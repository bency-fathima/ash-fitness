import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const getAllEmployees = createAsyncThunk(
  "finance/employees",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/finance/employees/${page}/${limit}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get employees"
      );
    }
  }
);

export const getAllEmployeeHistory = createAsyncThunk(
  "finance/employee/history",
  async ({id, page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/finance/employee/history/${page}/${limit}/${id}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get employee history",
      );
    }
  },
);
