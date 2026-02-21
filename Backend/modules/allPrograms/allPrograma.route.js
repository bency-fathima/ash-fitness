import express from "express";
import {
  createProgramController,
  deleteProgramController,
  getAllProgramByExpert,
  getAllProgramController,
  getAllProgramControllerByAdmin,
  getAllProgramControllerByCategory,
  getSingleProgramController,
  updateSingleProgramController,
  getFounderProgramList,
} from "./allPrograma.controller.js";
import { uploader } from "../../middleware/upload.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();
router.post("/create", authMiddleware, uploader.fields([{ name: "photo", maxCount: 1 }]), createProgramController);
router.get("/list/:page/:limit", getAllProgramController);
router.get("/founder/list/:page/:limit", authMiddleware, getFounderProgramList);
router.get("/get/:id", getSingleProgramController);
router.put("/update/:id", authMiddleware, updateSingleProgramController);
router.delete("/delete/:id", authMiddleware, deleteProgramController);

router.get("/get-all-programs-by-category/:category/:page/:limit", getAllProgramControllerByCategory)
router.get("/get-all-programs-by-admin/:adminId/:page/:limit", authMiddleware, getAllProgramControllerByAdmin)
router.get("/get-all-programs-by-expert/:expertId/:page/:limit", authMiddleware, getAllProgramByExpert)

export default router;
