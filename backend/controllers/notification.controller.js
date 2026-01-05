import Notification from "../models/Notification.model.js"

// Get user notifications
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query

    const notifications = await Notification.find({ user: req.userId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const unreadCount = await Notification.countDocuments({
      user: req.userId,
      isRead: false,
    })

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    })
  }
}

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { isRead: true },
      { new: true },
    )

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      })
    }

    res.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error("Mark as read error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update notification.",
    })
  }
}

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.userId, isRead: false }, { isRead: true })

    res.json({
      success: true,
      message: "All notifications marked as read.",
    })
  } catch (error) {
    console.error("Mark all as read error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update notifications.",
    })
  }
}

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      })
    }

    res.json({
      success: true,
      message: "Notification deleted successfully.",
    })
  } catch (error) {
    console.error("Delete notification error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
    })
  }
}
