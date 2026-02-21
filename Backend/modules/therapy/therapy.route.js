import express from "express";
import {
  createTherapyController,
  getAllTherapyController,
  getATherapyController,
  uploadMedia,
  updateTherapyController,
  deleteTherapyController,
} from "./therapy.controller.js";
import { uploader } from "../../middleware/upload.js";

const router = express.Router();

router.post("/", createTherapyController);
router.post("/upload-media", uploader.single("file"), uploadMedia);
router.get("/plan/:id", getATherapyController);
router.get("/:page/:limit", getAllTherapyController);
router.put("/:id", updateTherapyController);
router.delete("/:id", deleteTherapyController);

export default router;
