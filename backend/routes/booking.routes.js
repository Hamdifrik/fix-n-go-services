import express from "express"
import { authenticate, authorize } from "../middleware/auth.middleware.js"
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/booking.controller.js"

const router = express.Router()

// All routes require authentication
router.use(authenticate)

router.post("/", authorize("client"), createBooking)
router.get("/", getBookings)
router.get("/:id", getBookingById)
router.put("/:id/status", updateBookingStatus)
router.put("/:id/cancel", cancelBooking)

export default router
