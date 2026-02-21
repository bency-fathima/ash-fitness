import mongoose from "mongoose";


const habitSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, 
        },
        habits: [
      {
        name: {
          type: String,
          required: true,
        },
        logs: [
          {
            date: {
              type: Date,
              default: Date.now,
            },
            status: {
              type: String,
              enum: ["done", "missed"],
            },
          },
        ],
    }],
    },
    {
        timestamps: true,
    }
);      

const HabitModel = mongoose.model("Habit", habitSchema);
export default HabitModel;