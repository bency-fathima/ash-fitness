import express from "express";
import * as blogController from "./blog.controller.js";
import { uploader } from "../../middleware/upload.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, uploader.single("image") , blogController.createBlog);
router.get("/list", blogController.getAllBlogs);
router.get("/get/:blogId", blogController.getBlogById)
router.put("/update/:blogId", authMiddleware, blogController.updateBlogById);
router.delete("/delete/:blogId", authMiddleware, blogController.deleteBlogById);

export default router;