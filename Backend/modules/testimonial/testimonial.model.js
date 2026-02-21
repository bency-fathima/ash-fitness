import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      minlength: 10,
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    photo: { type: String, default: "default.jpg" },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);


export default mongoose.model("Testimonial",testimonialSchema)