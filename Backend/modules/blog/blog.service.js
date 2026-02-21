import { BlogModel } from "./blog.model.js";

export const createBlog = async (blog)=> {
    return await BlogModel.create(blog)
}

export const getAllBlogs = async ()=> {
    return await BlogModel.find().select("_id heading image createdAt");
}

export const getBlogById = async (blogId)=> {
    return await BlogModel.findById(blogId);
}

export const updateBlogById = async (blogId, updatedData)=> {
    return await BlogModel.updateOne({ _id: blogId }, { $set: updatedData });
}

export const deleteBlogById = async (blogId) => {
    return await BlogModel.findByIdAndDelete(blogId)
}
