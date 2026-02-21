import mongoose from "mongoose";

const assignedSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  planId: mongoose.Schema.Types.ObjectId,
  startDate: Date,
  currentWeek: {
    type: Number,
    default: 1
  }
});

export const AssignedNutrition =
  mongoose.models.AssignedNutrition ||
  mongoose.model("AssignedNutrition", assignedSchema);
