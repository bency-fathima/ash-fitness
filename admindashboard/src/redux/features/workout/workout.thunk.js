import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const createWorkout = createAsyncThunk(
  "workout/create",
  async (workoutData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("workout/create", workoutData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add workout"
      );
    }
  }
);

export const getAllWorkout = createAsyncThunk(
  "workout/get-all-workout",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `workout/get-all-workout/${page}/${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch workout"
      );
    }
  }
);
