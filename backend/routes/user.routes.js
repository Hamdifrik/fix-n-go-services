import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { getHelpers, getHelperById, getUserStats } from "../controllers/user.controller.js"

const router = express.Router()

router.get("/helpers", getHelpers)
router.get("/helpers/:id", getHelperById)
router.get("/stats", authenticate, getUserStats)

export default router
