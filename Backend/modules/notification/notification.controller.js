import * as notificationService from "./notification.service.js";

export const createNotification = async (req, res) => {
  try {
    const payload = {
      ...req.body,
    };

    if (!payload.recipientRole && !payload.recipientId) {
      payload.recipientRole = req.user?.role || "all";
    }

    const notification = await notificationService.createNotification(payload);

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRecentNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getRecentNotifications(
      req.user,
      req.query,
    );

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markNotificationAsRead(
      req.params.id,
      req.user,
    );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
