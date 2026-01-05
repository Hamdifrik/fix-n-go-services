import Review from "../models/Review.model.js"
import Booking from "../models/Booking.model.js"
import User from "../models/User.model.js"
import Notification from "../models/Notification.model.js"

// Create review
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      })
    }

    // Check if booking is completed
    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Can only review completed bookings.",
      })
    }

    // Check if client owns the booking
    if (booking.client.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      })
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId })
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted for this booking.",
      })
    }

    const review = new Review({
      booking: bookingId,
      client: req.userId,
      helper: booking.helper,
      rating,
      comment,
    })

    await review.save()

    // Update helper's rating
    const helper = await User.findById(booking.helper)
    const totalRating = helper.rating * helper.totalReviews + rating
    helper.totalReviews += 1
    helper.rating = totalRating / helper.totalReviews
    await helper.save()

    // Create notification for helper
    await Notification.create({
      user: booking.helper,
      type: "review",
      title: "New Review Received",
      message: `You received a ${rating}-star review`,
      relatedId: review._id,
    })

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      data: review,
    })
  } catch (error) {
    console.error("Create review error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create review.",
    })
  }
}

// Get helper reviews
export const getHelperReviews = async (req, res) => {
  try {
    const { helperId } = req.params
    const { page = 1, limit = 10 } = req.query

    const reviews = await Review.find({ helper: helperId })
      .populate("client", "firstName lastName avatar")
      .populate("booking", "service")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const count = await Review.countDocuments({ helper: helperId })

    res.json({
      success: true,
      data: reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    })
  } catch (error) {
    console.error("Get reviews error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
    })
  }
}

// Respond to review
export const respondToReview = async (req, res) => {
  try {
    const { response } = req.body
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      })
    }

    // Check if helper owns this review
    if (review.helper.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      })
    }

    review.response = response
    review.responseDate = new Date()
    await review.save()

    res.json({
      success: true,
      message: "Response added successfully!",
      data: review,
    })
  } catch (error) {
    console.error("Respond to review error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to respond to review.",
    })
  }
}
