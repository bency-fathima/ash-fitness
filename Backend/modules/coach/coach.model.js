import mongoose from "mongoose";

const coachSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    dob: { type: String, required: true },

    gender: { type: String, enum: ["male", "female", "other"], required: true },

    email: { type: String, required: true, unique: true, trim: true },

    phone: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    address: { type: String, required: true },

    role: { type: String, required: true },

    specialization: { type: Array, required: true },

    experience: { type: String, required: true },

    qualification: { type: String, required: true },

    certifications: { type: String, required: true },

    languages: { type: Array, required: true },

    assignedPrograms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProgramsList",
        required: true,
      },
    ],
    assignedTherapy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Therapy" }],

    image: { type: String },

    maxClient: { type: Number, required: true },

    workingDays: { type: Array, required: true },

    workingHours: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ],

    breakSlots: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ],

    maxDailyConsults: { type: Number, required: true },

    responseTime: { type: String, required: true },

    salary: { type: Number, required: true },

    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // ratingIncentive: { type: Boolean, default: false },

    // responseTimeIncentive: { type: Boolean, default: false },

    // complianceIncentive: { type: Boolean, default: false },

    autoSendWelcome: { type: Boolean, default: false },

    autoSendGuide: { type: Boolean, default: false },

    automatedReminder: { type: Boolean, default: false },

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    feedback: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        feedback: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    avgRating: { type: Number, default: 0 },
    extraClientIncentive: { type: Number, default: 0 },
    ratingIncentiveAmount: { type: Number, default: 0 }, // numeric value
    incentives: { type: Number, default: 0 }, // total
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true },
);

export const CoachModel = mongoose.model("Coach", coachSchema);
