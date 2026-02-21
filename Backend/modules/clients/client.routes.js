import express from "express";
import {
  deleteClient,
  getAllClients,
  getAllFeedbacks,
  getClientsBasedOnCoach,
  getMeasurementHistoryOnly,
  getSingleClient,
  getWeightHistoryOnly,
  updateClient,
  updateMeasurements,
  updateWeight,
  getFounderClientList,
  getComplianceStats,
  getClientsWithHabitPlan,
  assignDietPlan,
} from "./client.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { uploader } from "../../middleware/upload.js";


const router = express.Router()

router.get("/all-clients/:page/:limit", authMiddleware, getAllClients)
router.get("/founder/list/:page/:limit", authMiddleware, getFounderClientList);
router.get("/all-clients/:page/:limit", authMiddleware, getAllClients);
router.get("/get-client/:id", authMiddleware, getSingleClient)
router.post("/update-client/:id", authMiddleware, updateClient)
router.post(
  "/assign-diet-plan/:id",
  authMiddleware,
  uploader.single("file"),
  assignDietPlan,
);
router.delete("/delete-client/:id", authMiddleware, deleteClient)

router.post("/get-all-users-based-on-coach-for-admin", authMiddleware, getClientsBasedOnCoach)

router.put("/:userId/weight", authMiddleware, updateWeight);
router.put("/:userId/measurements", authMiddleware, updateMeasurements);
router.get("/get-all-feedbacks/:userId", authMiddleware, getAllFeedbacks)
router.get("/weight-history",authMiddleware, getWeightHistoryOnly);
router.get("/measurement-history",authMiddleware, getMeasurementHistoryOnly);
router.get("/compliance-stats",authMiddleware, getComplianceStats);

router.get("/clients", getClientsWithHabitPlan);


export default router;