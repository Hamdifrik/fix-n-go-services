import express from "express"
import { body } from "express-validator"
import { register, login, getProfile, updateProfile, changePassword } from "../controllers/auth.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"

const router = express.Router()

// Register
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
    body("role").isIn(["client", "helper"]),
  ],
  register,
)

// Login
router.post("/login", [body("email").isEmail().normalizeEmail(), body("password").notEmpty()], login)

// Get profile
router.get("/profile", authenticate, getProfile)

// Update profile
router.put("/profile", authenticate, updateProfile)

// Change password
router.put(
  "/change-password",
  authenticate,
  [body("currentPassword").notEmpty(), body("newPassword").isLength({ min: 6 })],
  changePassword,
)

export default router
