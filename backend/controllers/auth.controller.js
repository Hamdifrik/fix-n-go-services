import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import User from "../models/User.model.js"

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Register new user
export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const { email, password, firstName, lastName, role, phone, expertise, hourlyRate } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      })
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      ...(role === "helper" && { expertise, hourlyRate }),
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id, user.role)

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      })
    }

    // Generate token
    const token = generateToken(user._id, user.role)

    res.json({
      success: true,
      message: "Login successful!",
      data: {
        user,
        token,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    })
  }
}

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    })
  }
}

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "phone",
      "address",
      "avatar",
      "bio",
      "expertise",
      "hourlyRate",
      "experience",
    ]
    const updates = {}

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key]
      }
    })

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      })
    }

    res.json({
      success: true,
      message: "Profile updated successfully!",
      data: user,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    })
  }
}

// Change password
export const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      })
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: "Password changed successfully!",
    })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to change password.",
    })
  }
}
