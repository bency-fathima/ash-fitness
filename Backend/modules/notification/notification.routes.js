import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import * as notificationController from "./notification.controller.js";

const router = express.Router();

router.get("/recent", authMiddleware, notificationController.getRecentNotifications);
router.post("/", authMiddleware, notificationController.createNotification);
router.patch("/:id/read", authMiddleware, notificationController.markNotificationAsRead);

export default router;