import express from "express"
import * as coachController from "./coach.controller.js"
import { uploader } from "../../middleware/upload.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";


const router = express.Router();

router.post("/create", authMiddleware, uploader.fields([
  { name: "certifications", maxCount: 1 },
  { name: "photo", maxCount: 1 }
]), coachController.createCoach);
router.get("/get-all-coaches/:page/:limit", authMiddleware, coachController.getAllCoach);
router.get("/founder/list/:page/:limit", authMiddleware, coachController.getFounderCoachList);
router.post("/get-coaches-by-admin", authMiddleware, coachController.getCoachesByAdmin); //get all coach details of that admin by giving coach ids
router.put("/assign", authMiddleware, coachController.AssignCoachToUser);
router.get("/get-coach/:coachId", authMiddleware, coachController.getCoachById);
router.put("/update/:coachId", authMiddleware, uploader.fields([
  { name: "certifications", maxCount: 1 },
  { name: "photo", maxCount: 1 }
]), coachController.updateCoachById);
router.delete("/delete/:coachId", authMiddleware, coachController.deleteCoachById);
router.get("/assigned-users/:coachId/:page/:limit", authMiddleware, coachController.getUsersAssignedToACoach);

router.put("/feedback", authMiddleware, coachController.createFeedback);
router.get("/dashboard-stats/:coachId", authMiddleware, coachController.getCoachDashboardStats);
router.get(
  "/client-compliance-graph/:duration",
  authMiddleware,
  allowRoles("Coach", "Trainer", "Dietician", "Therapist"),
  coachController.getClientComplianceGraphData,
);

router.get("/rating-graph/:id", authMiddleware, coachController.getCoachRatingGraph);

export default router