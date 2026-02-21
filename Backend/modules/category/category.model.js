import mongoose from "mongoose";
import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      //   enum: ["Weight Management", "Disease Management"],
      unique: true,
    },
    programLimit: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Published",
    },
  },
  { timestamps: true },
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.name = capitalizeFirst(this.name);
  }

  if (this.isModified("status")) {
    this.status = capitalizeFirst(this.status);
  }

  next();
});

export const categoryModel = mongoose.model("Category", categorySchema);
