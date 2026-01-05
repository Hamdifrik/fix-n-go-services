import express from "express"
import { authenticate, authorize } from "../middleware/auth.middleware.js"
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getHelperServices,
} from "../controllers/service.controller.js"

const router = express.Router()

// Public routes
router.get("/", getServices)
router.get("/:id", getServiceById)

// Helper only routes
router.post("/", authenticate, authorize("helper"), createService)
router.put("/:id", authenticate, authorize("helper"), updateService)
router.delete("/:id", authenticate, authorize("helper"), deleteService)
router.get("/helper/my-services", authenticate, authorize("helper"), getHelperServices)

export default router
