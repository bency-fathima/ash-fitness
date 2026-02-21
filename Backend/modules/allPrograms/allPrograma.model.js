import mongoose from "mongoose";
import { capitalizeFirst } from "../../middleware/capitalizeFirst.js";

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    duration: {
      type: Array,
      required: true,
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    
    status:{
      type:String,
      enum:["Draft","Published"],
      default:"Draft"
    }
  },
  {
    timestamps: true,
  },
);

programSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.title = capitalizeFirst(this.title);
  }

  if (this.isModified("status")) {
    this.status = capitalizeFirst(this.status);
  }

  next();
});

const ProgramModel = mongoose.model("ProgramsList", programSchema);
export default ProgramModel;
