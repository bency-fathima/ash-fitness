import mongoose from "mongoose"


const broadcastSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        type: {type: String, required: true, enum: ["Promotional", "Welcome", "Motivation", "Tips", "Progress"]},
        message: {type: String, required: true},
        attachment: {type: String, default: null},
    },
    {timestamps: true}
)

export const broadcastModel = mongoose.model("Broadcast", broadcastSchema)