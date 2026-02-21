import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeType: {
      type: String,
      enum: ["Head", "Admin", "Coach"],
      required: true,
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "employeeType",
    },

    month: { type: Number, required: true },
    year: { type: Number, required: true },
    extraClientIncentive: { type: Number, default: 0 },
    ratingIncentive: { type: Number, default: 0 },
    baseSalary: { type: Number, required: true },
    incentive: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
  },
  { timestamps: true },
);

payrollSchema.index(
  { employeeId: 1, month: 1, year: 1 },
  { unique: true }, // prevent duplicate month entry
);

export const PayrollModel = mongoose.model("Payroll", payrollSchema);
