import Service from "../models/Service.model.js"

// Create new service
export const createService = async (req, res) => {
  try {
    const { title, description, category, price, duration, images, tags } = req.body

    const service = new Service({
      title,
      description,
      category,
      price,
      duration,
      helper: req.userId,
      images,
      tags,
    })

    await service.save()

    res.status(201).json({
      success: true,
      message: "Service created successfully!",
      data: service,
    })
  } catch (error) {
    console.error("Create service error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create service.",
    })
  }
}

// Get all services
export const getServices = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 10 } = req.query

    const query = { isActive: true }

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice)
    }

    const services = await Service.find(query)
      .populate("helper", "firstName lastName avatar rating totalReviews")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const count = await Service.countDocuments(query)

    res.json({
      success: true,
      data: services,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    })
  } catch (error) {
    console.error("Get services error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch services.",
    })
  }
}

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "helper",
      "firstName lastName avatar rating totalReviews bio expertise",
    )

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      })
    }

    res.json({
      success: true,
      data: service,
    })
  } catch (error) {
    console.error("Get service error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch service.",
    })
  }
}

// Update service
export const updateService = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      helper: req.userId,
    })

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or unauthorized.",
      })
    }

    const allowedUpdates = ["title", "description", "category", "price", "duration", "images", "tags", "isActive"]

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        service[key] = req.body[key]
      }
    })

    await service.save()

    res.json({
      success: true,
      message: "Service updated successfully!",
      data: service,
    })
  } catch (error) {
    console.error("Update service error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update service.",
    })
  }
}

// Delete service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      helper: req.userId,
    })

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or unauthorized.",
      })
    }

    res.json({
      success: true,
      message: "Service deleted successfully!",
    })
  } catch (error) {
    console.error("Delete service error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete service.",
    })
  }
}

// Get helper's services
export const getHelperServices = async (req, res) => {
  try {
    const services = await Service.find({ helper: req.userId }).sort({ createdAt: -1 })

    res.json({
      success: true,
      data: services,
    })
  } catch (error) {
    console.error("Get helper services error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch services.",
    })
  }
}
