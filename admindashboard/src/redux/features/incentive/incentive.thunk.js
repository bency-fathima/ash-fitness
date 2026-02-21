import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const createPayroll = createAsyncThunk(
  "incentive/update",
  async (payrollData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/incentive/update",
        payrollData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add payroll",
      );
    }
  },
);

export const getPayroll = createAsyncThunk(
  "incentive/get-incentive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/incentive/get-incentive");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to pay payroll",
      );
    }
  },
);