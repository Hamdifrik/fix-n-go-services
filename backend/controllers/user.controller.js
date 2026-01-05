import User from "../models/User.model.js"
import Booking from "../models/Booking.model.js"
import Service from "../models/Service.model.js"

// Get all helpers
export const getHelpers = async (req, res) => {
  try {
    const { expertise, minRating, search, page = 1, limit = 10 } = req.query

    const query = { role: "helper", isActive: true }

    if (expertise) {
      query.expertise = { $in: [expertise] }
    }

    if (minRating) {
      query.rating = { $gte: Number.parseFloat(minRating) }
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
      ]
    }

    const helpers = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 })

    const count = await User.countDocuments(query)

    res.json({
      success: true,
      data: helpers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    })
  } catch (error) {
    console.error("Get helpers error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch helpers.",
    })
  }
}

// Get helper by ID
export const getHelperById = async (req, res) => {
  try {
    const helper = await User.findOne({
      _id: req.params.id,
      role: "helper",
    }).select("-password")

    if (!helper) {
      return res.status(404).json({
        success: false,
        message: "Helper not found.",
      })
    }

    // Get helper's services
    const services = await Service.find({
      helper: helper._id,
      isActive: true,
    })

    res.json({
      success: true,
      data: {
        ...helper.toObject(),
        services,
      },
    })
  } catch (error) {
    console.error("Get helper error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch helper.",
    })
  }
}

// Get user stats
export const getUserStats = async (req, res) => {
  try {
    const stats = {}

    if (req.user.role === "helper") {
      const totalBookings = await Booking.countDocuments({ helper: req.userId })
      const completedBookings = await Booking.countDocuments({
        helper: req.userId,
        status: "completed",
      })
      const pendingBookings = await Booking.countDocuments({
        helper: req.userId,
        status: "pending",
      })
      const activeServices = await Service.countDocuments({
        helper: req.userId,
        isActive: true,
      })

      // Calculate total earnings
      const completedBookingsData = await Booking.find({
        helper: req.userId,
        status: "completed",
        paymentStatus: "paid",
      })

      const totalEarnings = completedBookingsData.reduce((sum, booking) => sum + booking.totalPrice, 0)

      stats.totalBookings = totalBookings
      stats.completedBookings = completedBookings
      stats.pendingBookings = pendingBookings
      stats.activeServices = activeServices
      stats.totalEarnings = totalEarnings
    } else if (req.user.role === "client") {
      const totalBookings = await Booking.countDocuments({ client: req.userId })
      const completedBookings = await Booking.countDocuments({
        client: req.userId,
        status: "completed",
      })
      const pendingBookings = await Booking.countDocuments({
        client: req.userId,
        status: "pending",
      })

      stats.totalBookings = totalBookings
      stats.completedBookings = completedBookings
      stats.pendingBookings = pendingBookings
    }

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Get user stats error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics.",
    })
  }
}
