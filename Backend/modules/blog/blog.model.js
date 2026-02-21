import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true},
    points: [{
        subHeading: { type: String },
        detail: { type: String }
    }]
}, { timestamps: true });

export const BlogModel = mongoose.model('Blog', blogSchema);