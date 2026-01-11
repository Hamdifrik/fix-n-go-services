import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { deleteFile } from "../middleware/upload.middleware.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Upload single image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      })
    }

    const category = req.body.category || "general"
    const imageUrl = `/uploads/${category}/${req.file.filename}`

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        filename: req.file.filename,
        url: imageUrl,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    })
  }
}

// Upload multiple images
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      })
    }

    const category = req.body.category || "general"
    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      url: `/uploads/${category}/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }))

    res.status(201).json({
      success: true,
      message: `${uploadedFiles.length} images uploaded successfully`,
      data: uploadedFiles,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading images",
      error: error.message,
    })
  }
}

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const { filename, category } = req.body

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required",
      })
    }

    const filePath = `uploads/${category || "general"}/${filename}`
    const deleted = deleteFile(filePath)

    if (deleted) {
      res.json({
        success: true,
        message: "Image deleted successfully",
      })
    } else {
      res.status(404).json({
        success: false,
        message: "File not found",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting image",
      error: error.message,
    })
  }
}

// Get image (serve static file)
export const getImage = async (req, res) => {
  try {
    const { category, filename } = req.params
    const filePath = path.join(__dirname, "..", "uploads", category, filename)

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath)
    } else {
      res.status(404).json({
        success: false,
        message: "Image not found",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving image",
      error: error.message,
    })
  }
}
