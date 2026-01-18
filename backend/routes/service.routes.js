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

// Helper only routes (placer AVANT "/:id" pour éviter le conflit)
router.get("/helper/my-services", authenticate, authorize("helper"), getHelperServices)
router.get("/:id", getServiceById)
router.post("/", authenticate, authorize("helper"), createService)
router.put("/:id", authenticate, authorize("helper"), updateService)
router.delete("/:id", authenticate, authorize("helper"), deleteService)

export default router
