import mongoose from "mongoose";
import NotificationModel from "./notification.model.js";

const COACH_ROLE_ALIASES = [
  "coach",
  "expert",
  "trainer",
  "dietician",
  "dietitian",
  "therapist",
];

const normalizeRole = (rawRole = "") => {
  const role = String(rawRole || "").trim().toLowerCase();

  if (!role) return "all";
  if (COACH_ROLE_ALIASES.includes(role)) return "coach";
  if (["admin", "head", "founder", "user", "all"].includes(role)) return role;

  return "all";
};

const parseLimit = (limitValue) => {
  const parsed = Number(limitValue);
  if (!Number.isFinite(parsed)) return 4;
  return Math.max(1, Math.min(parsed, 20));
};

const toObjectIdIfValid = (value) => {
  if (!value) return null;
  if (!mongoose.Types.ObjectId.isValid(value)) return null;
  return new mongoose.Types.ObjectId(value);
};

const getRoleAliases = (role) => {
  if (role === "coach") return ["coach", "expert"];
  return [role];
};

export const createNotification = async (notificationData = {}) => {
  const {
    type = "generic",
    title = "",
    message,
    recipientRole = "all",
    recipientId,
    metadata = {},
    isRead = false,
  } = notificationData;

  if (!message || !String(message).trim()) {
    throw new Error("Notification message is required");
  }

  const normalizedRole = normalizeRole(recipientRole);
  const parsedRecipientId = toObjectIdIfValid(recipientId);

  if (recipientId && !parsedRecipientId) {
    throw new Error("Invalid recipientId");
  }

  const notification = await NotificationModel.create({
    type,
    title,
    message: String(message).trim(),
    recipientRole: normalizedRole,
    recipientId: parsedRecipientId,
    metadata: metadata && typeof metadata === "object" ? metadata : {},
    isRead: Boolean(isRead),
    readAt: isRead ? new Date() : null,
  });

  return notification;
};

export const getRecentNotifications = async (user, query = {}) => {
  const normalizedRole = normalizeRole(user?.role);
  const roleAliases = getRoleAliases(normalizedRole);
  const limit = parseLimit(query.limit);

  const userId = toObjectIdIfValid(user?._id || user?.id);
  const accessFilters = [
    { recipientRole: "all" },
    ...roleAliases.map((role) => ({ recipientRole: role })),
  ];

  if (userId) {
    accessFilters.push({ recipientId: userId });
  }

  const notifications = await NotificationModel.find({
    $or: accessFilters,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return notifications;
};

export const markNotificationAsRead = async (notificationId, user) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new Error("Invalid notification id");
  }

  const normalizedRole = normalizeRole(user?.role);
  const roleAliases = getRoleAliases(normalizedRole);
  const userId = toObjectIdIfValid(user?._id || user?.id);

  const accessFilters = [
    { recipientRole: "all" },
    ...roleAliases.map((role) => ({ recipientRole: role })),
  ];

  if (userId) {
    accessFilters.push({ recipientId: userId });
  }

  const notification = await NotificationModel.findOneAndUpdate(
    {
      _id: notificationId,
      $or: accessFilters,
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
    { new: true },
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};
