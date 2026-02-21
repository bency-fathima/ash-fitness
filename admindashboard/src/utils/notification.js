export const formatNotificationTime = (dateString) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "N/A";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (diffInDays <= 0) {
    return `Today, ${time}`;
  }

  if (diffInDays === 1) {
    return `Yesterday, ${time}`;
  }

  return `${diffInDays} Days Ago, ${time}`;
};

const DASHBOARD_NOTIFICATION_STYLE_MAP = {
  whatsapp_delivery_failed: {
    bgClass: "bg-[#EBF3F2]",
    icon: "bell",
    iconClass: "text-[#9e5608]",
  },
  feedback_received: {
    bgClass: "bg-[#FAF3E0]",
    icon: "message",
    iconClass: "text-[#DAA520]",
  },
  pending_meal_reviews: {
    bgClass: "bg-[#F0FDF4]",
    icon: "refresh",
    iconClass: "text-[#45C4A2]",
  },
  expert_change_request: {
    bgClass: "bg-[#FAF3E0]",
    icon: "bell",
    iconClass: "text-[#DAA520]",
  },
  meal_approved: {
    bgClass: "bg-[#EBF3F2]",
    icon: "bell",
    iconClass: "text-[#9e5608]",
  },
  meal_skipped: {
    bgClass: "bg-[#FAF3E0]",
    icon: "bell",
    iconClass: "text-[#DAA520]",
  },
  diet_feedback: {
    bgClass: "bg-[#FAF3E0]",
    icon: "message",
    iconClass: "text-[#DAA520]",
  },
  trainer_updated: {
    bgClass: "bg-[#F0FDF4]",
    icon: "refresh",
    iconClass: "text-[#45C4A2]",
  },
  generic: {
    bgClass: "bg-[#EBF3F2]",
    icon: "bell",
    iconClass: "text-[#9e5608]",
  },
};

export const getDashboardNotificationStyle = (type) =>
  DASHBOARD_NOTIFICATION_STYLE_MAP[type] || DASHBOARD_NOTIFICATION_STYLE_MAP.generic;

const CLIENT_NOTIFICATION_BUBBLE_CLASS = {
  meal_skipped: "bg-[#FBEAD9]",
  diet_feedback: "bg-[#FBEAD9]",
  expert_change_request: "bg-[#FBEAD9]",
  feedback_received: "bg-[#FBEAD9]",
  whatsapp_delivery_failed: "bg-[#9e5608]",
  pending_meal_reviews: "bg-[#9e5608]",
  meal_approved: "bg-[#9e5608]",
  trainer_updated: "bg-[#FBEAD9]",
  generic: "bg-[#9e5608]",
};

export const getClientNotificationBubbleClass = (type) =>
  CLIENT_NOTIFICATION_BUBBLE_CLASS[type] || CLIENT_NOTIFICATION_BUBBLE_CLASS.generic;
