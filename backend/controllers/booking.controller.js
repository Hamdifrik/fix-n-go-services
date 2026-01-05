import Booking from "../models/Booking.model.js"
import Service from "../models/Service.model.js"
import Notification from "../models/Notification.model.js"

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { serviceId, scheduledDate, address, notes } = req.body

    const service = await Service.findById(serviceId).populate("helper")

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      })
    }

    const booking = new Booking({
      client: req.userId,
      helper: service.helper._id,
      service: serviceId,
      scheduledDate,
      address,
      notes,
      totalPrice: service.price,
    })

    await booking.save()

    // Create notification for helper
    await Notification.create({
      user: service.helper._id,
      type: "booking",
      title: "New Booking Request",
      message: `You have a new booking request for ${service.title}`,
      relatedId: booking._id,
    })

    res.status(201).json({
      success: true,
      message: "Booking created successfully!",
      data: booking,
    })
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create booking.",
    })
  }
}

// Get bookings
export const getBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query

    const query = {}

    if (req.user.role === "client") {
      query.client = req.userId
    } else if (req.user.role === "helper") {
      query.helper = req.userId
    }

    if (status) {
      query.status = status
    }

    const bookings = await Booking.find(query)
      .populate("client", "firstName lastName email phone")
      .populate("helper", "firstName lastName email phone avatar")
      .populate("service", "title category price")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const count = await Booking.countDocuments(query)

    res.json({
      success: true,
      data: bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    })
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
    })
  }
}

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("client", "firstName lastName email phone")
      .populate("helper", "firstName lastName email phone avatar rating")
      .populate("service", "title category price duration")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      })
    }

    // Check authorization
    if (
      booking.client._id.toString() !== req.userId.toString() &&
      booking.helper._id.toString() !== req.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      })
    }

    res.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error("Get booking error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking.",
    })
  }
}

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      })
    }

    // Only helper can update status
    if (booking.helper.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the helper can update booking status.",
      })
    }

    booking.status = status

    if (status === "completed") {
      booking.completedAt = new Date()
    }

    await booking.save()

    // Create notification for client
    await Notification.create({
      user: booking.client,
      type: "booking",
      title: "Booking Status Updated",
      message: `Your booking status has been updated to ${status}`,
      relatedId: booking._id,
    })

    res.json({
      success: true,
      message: "Booking status updated successfully!",
      data: booking,
    })
  } catch (error) {
    console.error("Update booking status error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update booking status.",
    })
  }
}

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      })
    }

    // Check if user is authorized to cancel
    if (booking.client.toString() !== req.userId.toString() && booking.helper.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this booking.",
      })
    }

    booking.status = "cancelled"
    booking.cancelledAt = new Date()
    booking.cancellationReason = reason

    await booking.save()

    // Notify the other party
    const notifyUserId = booking.client.toString() === req.userId.toString() ? booking.helper : booking.client

    await Notification.create({
      user: notifyUserId,
      type: "booking",
      title: "Booking Cancelled",
      message: `A booking has been cancelled. Reason: ${reason || "No reason provided"}`,
      relatedId: booking._id,
    })

    res.json({
      success: true,
      message: "Booking cancelled successfully!",
      data: booking,
    })
  } catch (error) {
    console.error("Cancel booking error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking.",
    })
  }
}
