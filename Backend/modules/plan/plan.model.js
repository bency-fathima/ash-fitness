import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    notes: { type: String },
    url: { type: String },
    mediaName: { type: String },
    type: {
        type: String,
        enum: ["Workout", "Meal", "Therapy"],
        default: "Workout"
    },
});

const daySchema = new mongoose.Schema({
    name: { type: String, required: true },
    exercises: [exerciseSchema],
});

const weekSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String },
    days: [daySchema],
});

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        duration: {
            type: String,
            required: true,
        },
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProgramsList",
            required: true,
        },
        weeks: [weekSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Plan", planSchema);
