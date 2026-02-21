import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    dob: { type: String, required: true },

    gender: { type: String, enum: ["male", "female", "other"] },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: { type: String, required: true },

    password: { type: String, required: true },

    address: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "admin", "coach"],
      default: "user",
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    currentWeight: { type: Number, required: true },
    weightHistory: [
      {
        weight: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    measurements: {
      chest: { type: Number },
      waist: { type: Number },
      hip: { type: Number },
    },

    measurementHistory: [
      {
        chest: { type: Number },
        waist: { type: Number },
        hip: { type: Number },
        date: { type: Date, default: Date.now },
      },
    ],

    targetWeight: { type: Number, required: true },

    medicalConditions: { type: Array, required: true },

    allergies: { type: Array, required: true },

    goals: { type: String },

    foodPreferences: { type: String, required: true },

    profileImage: { type: String },

    programType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProgramsList",
      required: true,
    },
    therapyType:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Therapy",
      
    },

    duration: { type: Number, required: true },

    programStartDate: { type: String, required: true },

    programEndDate: { type: String, required: true },

    dietition: { type: mongoose.Schema.Types.ObjectId, ref: "Coach" },

    trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Coach" },

    therapist: { type: mongoose.Schema.Types.ObjectId, ref: "Coach" },

    autoSendGuide: { type: Boolean, default: false },

    autoSendWelcome: { type: Boolean, default: false },

    automatedReminder: { type: Boolean, default: false },

    currentGlobalDay: { type: Number, default: 1 },

    lastDayCompletionTime: { type: Date },

    lastTaskSubmissionDate: { type: Date },

    lastMissedSyncDate: { type: Date },

    dietPlanPdf: { type: String },

    dietPlanMealCount: { type: Number, default: 6 },

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
