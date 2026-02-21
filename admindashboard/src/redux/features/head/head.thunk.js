import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const createHead = createAsyncThunk(
  "head/create",
  async (headData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("heads/create", headData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add head",
      );
    }
  },
);

export const getAllHeads = createAsyncThunk(
  "head/get-all-heads",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `heads/get-all-heads/${page}/${limit}`,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get heads",
      );
    }
  },
);

export const getHead = createAsyncThunk(
  "head/get-head",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`heads/get-head/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get heads",
      );
    }
  },
);

export const updateHead = createAsyncThunk(
  "head/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.put(`/heads/update/${id}`, updatedData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update head",
      );
    }
  },
);

export const deleteHead = createAsyncThunk(
  "head/delete/:id",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.delete(`/heads/delete/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete head",
        },
      );
    }
  },
);

export const getDashboardData = createAsyncThunk(
  "head/get-dashboard-data",
  async ({ headId, duration }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `heads/dashboard-data/${headId}?duration=${duration || '3'}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get dashboard data",
      );
    }
  },
);

export const getAllCoachesByHead = createAsyncThunk(
  "head/get-all-coaches-by-head",
  async ({ headId, page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `heads/get-all-coaches-by-head/${headId}/${page}/${limit}`,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get coaches by head",
      );
    }
  },
);

export const getAllUsersByHead = createAsyncThunk(
  "head/get-all-users-by-head",
  async ({ headId, page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `heads/get-all-users-by-head/${headId}/${page}/${limit}`,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get users by head",
      );
    }
  },
);

export const getFounderAllHeads = createAsyncThunk(
  "head/founder/list/",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `heads/founder/list/${page}/${limit}`,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to get heads",
      );
    }
  },
);