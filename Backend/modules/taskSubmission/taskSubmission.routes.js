import express from "express";
import { submitTask, submitMultipleWorkoutTasks, getPendingSubmissions, verifyTask, rejectTask, getUserTaskStatus, getAllUserSubmissions } from "./taskSubmission.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { uploader } from "../../middleware/upload.js";

const router = express.Router();

// Client routes
router.post("/submit", authMiddleware, uploader.single("file"), submitTask);
router.post("/submit-multiple-workouts", authMiddleware, uploader.single("file"), submitMultipleWorkoutTasks);
router.get("/my-status", authMiddleware, getUserTaskStatus);

// Expert/Admin routes
// Assuming 'coach' and 'admin' can verify
router.get("/user/:userId/all", authMiddleware, getAllUserSubmissions);
router.get("/pending", authMiddleware, getPendingSubmissions);
router.patch("/:id/verify", authMiddleware, allowRoles( "expert","coach", "Trainer", "Dietician", "Therapist"), verifyTask);
router.patch("/:id/reject", authMiddleware, allowRoles( "expert","coach", "Trainer", "Dietician", "Therapist"), rejectTask);

export default router;
