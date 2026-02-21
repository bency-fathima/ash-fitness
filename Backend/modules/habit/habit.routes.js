import express from "express";
import {
  createHabitsController,
  getClientHabitsController,
  getDailyClientHabitSummaryController,
  getHabitByIdController,
  getWeeklyClientHabitSummaryController,
  updateHabitById,
  updateHabitStatusController,
} from "./habit.controller.js";
const router = express.Router();

router.get("/daily-habit", getDailyClientHabitSummaryController);
router.get("/weekly-habit",getWeeklyClientHabitSummaryController);
router.post("/:clientId", createHabitsController);
router.get("/:clientId", getClientHabitsController);
router.patch("/:habitId", updateHabitById);
router.get("/get/:habitId", getHabitByIdController);
router.put("/:clientId", updateHabitStatusController);

export default router;
