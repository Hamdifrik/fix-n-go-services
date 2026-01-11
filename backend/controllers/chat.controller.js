import Conversation from "../models/Conversation.model.js"
import Message from "../models/Message.model.js"

// Get or create conversation between two users
export const getOrCreateConversation = async (req, res) => {
  try {
    const { helperId, serviceId } = req.body
    const clientId = req.userId

    if (!helperId) {
      return res.status(400).json({
        success: false,
        message: "Helper ID is required",
      })
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [clientId, helperId] },
      service: serviceId || null,
    }).populate("participants", "firstName lastName avatar role")
      .populate("service", "title")
      .populate("lastMessage")

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [clientId, helperId],
        service: serviceId || null,
      })

      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "firstName lastName avatar role")
        .populate("service", "title")
    }

    res.status(200).json({
      success: true,
      data: conversation,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating conversation",
      error: error.message,
    })
  }
}

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.userId

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    })
      .populate("participants", "firstName lastName avatar role")
      .populate("service", "title")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 })

    res.status(200).json({
      success: true,
      data: conversations,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching conversations",
      error: error.message,
    })
  }
}

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.userId
    const { page = 1, limit = 50 } = req.query

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      })
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "firstName lastName avatar role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    // Mark messages as read
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

    res.status(200).json({
      success: true,
      data: messages.reverse(),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message,
    })
  }
}

// Send a message (REST fallback, WebSocket preferred)
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, messageType = "text", attachments = [] } = req.body
    const senderId = req.userId

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId,
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      })
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      content,
      messageType,
      attachments,
    })

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    })

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "firstName lastName avatar role")

    res.status(201).json({
      success: true,
      data: populatedMessage,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    })
  }
}

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params
    const userId = req.userId

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

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking messages as read",
      error: error.message,
    })
  }
}

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId

    // Get all conversations for user
    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    })

    const conversationIds = conversations.map((c) => c._id)

    const unreadCount = await Message.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: userId },
      isRead: false,
    })

    res.status(200).json({
      success: true,
      data: { unreadCount },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting unread count",
      error: error.message,
    })
  }
}
