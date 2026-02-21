import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import readline from "readline";
import { fileURLToPath } from "url";

dotenv.config();

const founderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },

    password: { type: String, required: true },

    role: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    phone: { type: String },
    address: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true, strict: false },
);

export const FounderModel = mongoose.model("Founder", founderSchema);

const seedAdmin = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log(" Database connected");

    const email = await ask("Enter Admin Email: ");
    const password = await ask("Enter Admin Password: ");
    rl.close();

    if (!email || !password) {
      console.log("Email and Password are required.");
      process.exit(1);
    }

    const existing = await FounderModel.findOne({ email });

    if (existing) {
      console.log(" Admin already exists. Skipping seed.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const adminUser = await FounderModel.create({
      name: "Founder",
      email,
      password: hashedPassword,
      role: "founder",
      status: "Active",
    });

    console.log(" Admin created successfully!");
    console.log("Login with:");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (err) {
    console.log("Seed failed:", err);
    rl.close(); // ensure rl is closed on error
    process.exit(1);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedAdmin();
}
