import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import Message from "../models/Message.model.js"
import Conversation from "../models/Conversation.model.js"
import Notification from "../models/Notification.model.js"
import User from "../models/User.model.js"

// Store connected users
const connectedUsers = new Map()

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:3000",
        process.env.FRONTEND_URL,
      ].filter(Boolean),
      credentials: true,
    },
  })

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    
    if (!token) {
      return next(new Error("Authentication error: No token provided"))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.userId
      socket.user = decoded
      next()
    } catch (error) {
      return next(new Error("Authentication error: Invalid token"))
    }
  })

  io.on("connection", (socket) => {
    const userId = socket.userId
    console.log(`✅ User connected: ${userId}`)

    // Store user's socket
    connectedUsers.set(userId, socket.id)

    // Join user's personal room
    socket.join(`user:${userId}`)

    // Emit online status
    socket.broadcast.emit("user:online", { userId })

    // Join conversation room
    socket.on("conversation:join", async (conversationId) => {
      try {
        // Verify user is part of conversation
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: userId,
        })

        if (conversation) {
          socket.join(`conversation:${conversationId}`)
          console.log(`User ${userId} joined conversation ${conversationId}`)
        }
      } catch (error) {
        console.error("Error joining conversation:", error)
      }
    })

    // Leave conversation room
    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`)
      console.log(`User ${userId} left conversation ${conversationId}`)
    })

    // Handle sending message
    socket.on("message:send", async (data) => {
      try {
        const { conversationId, content, messageType = "text", attachments = [] } = data

        // Verify user is part of conversation
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: userId,
        })

        if (!conversation) {
          socket.emit("error", { message: "Conversation not found" })
          return
        }

        // Create message
        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          content,
          messageType,
          attachments,
        })

        // Update conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          lastMessageAt: new Date(),
        })

        // Populate message
        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "firstName lastName avatar role")

        // Emit to all users in conversation
        io.to(`conversation:${conversationId}`).emit("message:new", populatedMessage)

        // Get sender info for notification
        const sender = await User.findById(userId).select("firstName lastName avatar")
        const senderName = sender ? `${sender.firstName} ${sender.lastName}` : "Quelqu'un"

        // Notify other participants who are not in the conversation room
        for (const participantId of conversation.participants) {
          if (participantId.toString() !== userId) {
            // Create notification in database
            await Notification.create({
              user: participantId,
              type: "message",
              title: `Nouveau message de ${senderName}`,
              message: content.length > 100 ? content.substring(0, 100) + "..." : content,
              data: {
                conversationId,
                messageId: message._id,
                senderId: userId,
              },
            })

            // Emit real-time notification
            io.to(`user:${participantId}`).emit("message:notification", {
              conversationId,
              messageId: message._id,
              content,
              senderName,
              senderAvatar: sender?.avatar,
              senderId: userId,
              createdAt: message.createdAt,
            })
          }
        }

      } catch (error) {
        console.error("Error sending message:", error)
        socket.emit("error", { message: "Error sending message" })
      }
    })

    // Handle typing indicator
    socket.on("typing:start", (conversationId) => {
      socket.to(`conversation:${conversationId}`).emit("typing:start", {
        userId,
        conversationId,
      })
    })

    socket.on("typing:stop", (conversationId) => {
      socket.to(`conversation:${conversationId}`).emit("typing:stop", {
        userId,
        conversationId,
      })
    })

    // Handle message read
    socket.on("message:read", async (data) => {
      try {
        const { conversationId } = data

        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: userId },
            isRead: false,
          },
          {
            isRead: true,
            readAt: new Date(),
          }
        )

        socket.to(`conversation:${conversationId}`).emit("message:read", {
          conversationId,
          readBy: userId,
        })
      } catch (error) {
        console.error("Error marking messages as read:", error)
      }
    })

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${userId}`)
      connectedUsers.delete(userId)
      socket.broadcast.emit("user:offline", { userId })
    })
  })

  return io
}

// Utility to check if user is online
export const isUserOnline = (userId) => {
  return connectedUsers.has(userId.toString())
}

// Utility to get socket ID for a user
export const getSocketId = (userId) => {
  return connectedUsers.get(userId.toString())
}
