import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { uploadSingle, uploadMultiple } from "../middleware/upload.middleware.js"
import {
  uploadImage,
  uploadImages,
  deleteImage,
  getImage,
} from "../controllers/upload.controller.js"

const router = express.Router()

// Public route to get images
router.get("/:category/:filename", getImage)

// Protected routes
router.post("/single", authenticate, uploadSingle, uploadImage)
router.post("/multiple", authenticate, uploadMultiple, uploadImages)
router.delete("/", authenticate, deleteImage)

export default router
