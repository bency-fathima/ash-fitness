import { useCallback, useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

export const useRecentNotifications = (limit = 4) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(`/notifications/recent?limit=${limit}`);
      setNotifications(response?.data || []);
    } catch (err) {
      setError(err?.message || "Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    refetchNotifications: fetchNotifications,
  };
};

export default useRecentNotifications;
