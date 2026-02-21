import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    roomId: { type: String },
    participants: { type: Array, default: [] },
    messages: { type: Array, default: [] },
  },
  { timestamps: true }
);

export const ChatModel = mongoose.model("Chat", chatSchema);
