import React from "react";
import { assets } from "@/assets/asset";
import useRecentNotifications from "@/hooks/useRecentNotifications";
import {
  formatNotificationTime,
  getClientNotificationBubbleClass,
} from "@/utils/notification";

export default function NotificationsList() {
  const { notifications, loading } = useRecentNotifications(4);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mt-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#9e5608] font-bold text-sm uppercase tracking-wider">
          Recent Notifications
        </h3>
        <img
          src={assets.threeDotVector}
          alt="more"
          className="w-4 h-4 cursor-pointer"
        />
      </div>
      <div className="space-y-6">
        {loading ? (
          <p className="text-sm text-gray-400">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-400">No notifications yet</p>
        ) : (
          notifications.map((notification) => {
            const bgClass = getClientNotificationBubbleClass(notification.type);
            const isDarkBubble = bgClass === "bg-[#9e5608]";

            return (
              <div key={notification._id} className="flex gap-4 items-start">
                <div
                  className={`w-9 h-9 mt-0.5 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${bgClass}`}
                >
                  <img
                    src={assets.bellVector}
                    alt="notification"
                    className={`w-4 h-4 ${
                      isDarkBubble ? "invert brightness-0" : "opacity-60"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-gray-800 leading-[1.3]">
                    {notification.message}
                  </p>
                  <p className="text-[11px] text-gray-400 font-bold mt-1.5 leading-none">
                    {formatNotificationTime(notification.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
