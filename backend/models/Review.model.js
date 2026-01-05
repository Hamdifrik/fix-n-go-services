import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    response: {
      type: String,
      maxlength: 500,
    },
    responseDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

const Review = mongoose.model("Review", reviewSchema)

export default Review
