import express from "express";
import {
  createFaqController,
  deleteFaqController,
  getFaqByIdController,
  getFaqsController,
  updateFaqController,
} from "./faq.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createFaqController);
router.get("/", getFaqsController);
router.get("/:id", getFaqByIdController);
router.put("/:id", authMiddleware, updateFaqController);
router.delete("/:id", authMiddleware, deleteFaqController);

export default router;
