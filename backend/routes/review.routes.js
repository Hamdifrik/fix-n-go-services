import express from "express"
import { authenticate, authorize } from "../middleware/auth.middleware.js"
import { createReview, getHelperReviews, respondToReview } from "../controllers/review.controller.js"

const router = express.Router()

router.post("/", authenticate, authorize("client"), createReview)
router.get("/helper/:helperId", getHelperReviews)
router.put("/:id/respond", authenticate, authorize("helper"), respondToReview)

export default router
