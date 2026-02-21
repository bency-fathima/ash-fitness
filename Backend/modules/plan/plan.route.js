import express from "express"
import { createNewPlan, getPlanByProgramId, getSinglePlanById, uploadMedia, updatePlan, deletePlan } from "./plan.contoller.js";
import { uploader } from "../../middleware/upload.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";


const router = express.Router();

router.post("/create-plan", authMiddleware, createNewPlan)
router.post("/upload-media", authMiddleware, uploader.single("file"), uploadMedia);
router.get("/get-plan-by-id/:planId", authMiddleware, getSinglePlanById)
router.get("/get-plan-by-programId/:programId", authMiddleware, getPlanByProgramId)
router.put("/update-plan/:planId", authMiddleware, updatePlan)
router.delete("/delete-plan/:planId", authMiddleware, deletePlan)

export default router