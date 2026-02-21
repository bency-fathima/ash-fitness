import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const getAllAdmins = createAsyncThunk(
  "admins/all-admins",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/admin/all-admins/${page}/${limit}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const createAdmin = createAsyncThunk(
  "admins/create-admin",
  async (adminData, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/admin/add-admin", adminData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "creating admin failed",
      );
    }
  },
);

export const getAdminProfile = createAsyncThunk(
  "admins/get-admin-profile",
  async (id, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/admin/admin-profile/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetching admin profile failed",
      );
    }
  },
);

export const getAllCoachesByAdminId = createAsyncThunk(
  "coach/getAllCoachesByAdminId",
  async ({ adminId, page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/admin/get-all-coaches-by-admin/${adminId}/${page}/${limit}`,
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get coaches by admin id",
      );
    }
  },
);

export const getDashboardData = createAsyncThunk(
  "admins/getDashboardData",
  async ({ adminId, duration }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/admin/dashboard-data/${adminId}?duration=${duration || '12m'}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get dashboard data",
      );
    }
  },
);

export const getAdminsByHeadId = createAsyncThunk(
  "admins/getAdminsByHeadId",
  async ({ headId, page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/admin/get-admin-by-head/${headId}/${page}/${limit}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get admins by head id",
      );
    }
  },
);

export const getFounderAllAdmins = createAsyncThunk(
  "admins/founder/list",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/admin/founder/list/${page}/${limit}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get admins",
      );
    }
  },
);