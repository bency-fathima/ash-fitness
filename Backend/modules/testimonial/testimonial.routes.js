import express from "express";
import {
  testimonialController,
  getAllTestimonialsController,
  getSingleTestimonialController,
  updateTestimonialController,
  deleteTestimonialController,
  deleteAllTestimonialController,
} from "./testimonial.controller.js";
import { uploader } from "../../middleware/upload.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
// import upload from"../../middleware/upload.js";

const router = express.Router();

router.post("/", authMiddleware, uploader.single("photo"), testimonialController);
router.get("/", getAllTestimonialsController);
router.get("/:id", getSingleTestimonialController);
router.put("/:id", authMiddleware, updateTestimonialController);
router.delete("/:id", authMiddleware, deleteTestimonialController);
router.delete('/', authMiddleware, deleteAllTestimonialController)

export default router;
