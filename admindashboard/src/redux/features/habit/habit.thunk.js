import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

export const createHabitsThunk = createAsyncThunk(
  "habit/create",
  async ({ clientId, habits }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/habits/${clientId}`, {
        habits,
      });
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create habits",
      );
    }
  },
);

export const getClientHabitsThunk = createAsyncThunk(
  "habit/getClientHabits",
  async (clientId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/habits/${clientId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch habits",
      );
    }
  },
);

export const getClientHabitByHabitId = createAsyncThunk(
  "clients/getHabitPlan",
  async (habitId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/habits/get/${habitId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Habit",
      );
    }
  },
);

export const updateHabitStatusThunk = createAsyncThunk(
  "habit/updateStatus",
  async ({ clientId, habitId, status }) => {
    const response = await axiosInstance.put(`/habits/${clientId}`, {
      habitId,
      status,
    });

    return response.data;
  },
);

export const getDailyHabitSummaryThunk = createAsyncThunk(
  "habit/getDailySummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/habits/daily-habit");
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch summary",
      );
    }
  },
);


export const getWeeklyHabitSummaryThunk = createAsyncThunk(
  "habit/getWeeklySummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/habits/weekly-habit"
      );

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch weekly summary"
      );
    }
  }
);