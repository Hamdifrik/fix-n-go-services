import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  getUnreadCount,
} from "../controllers/chat.controller.js"

const router = express.Router()

// All routes require authentication
router.use(authenticate)

// Conversation routes
router.post("/conversations", getOrCreateConversation)
router.get("/conversations", getConversations)
router.get("/conversations/:conversationId/messages", getMessages)
router.put("/conversations/:conversationId/read", markAsRead)

// Message routes
router.post("/messages", sendMessage)

// Unread count
router.get("/unread", getUnreadCount)

export default router
