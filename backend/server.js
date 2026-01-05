import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

// Import routes
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import serviceRoutes from "./routes/service.routes.js"
import bookingRoutes from "./routes/booking.routes.js"
import reviewRoutes from "./routes/review.routes.js"
import notificationRoutes from "./routes/notification.routes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Liste des origines autorisées
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:3000", 
  process.env.FRONTEND_URL
].filter(Boolean) // Enlève les valeurs undefined

// Middleware CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Autoriser les requêtes sans origin (comme les apps mobiles ou Postman)
      if (!origin) return callback(null, true)
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.log(`❌ Origin bloquée: ${origin}`)
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/notifications", notificationRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Fix-n-Go API is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`🌐 Origines autorisées: ${allowedOrigins.join(", ")}`)
    })
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  })