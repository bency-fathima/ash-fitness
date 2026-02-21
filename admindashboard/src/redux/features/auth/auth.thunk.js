import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/auth/login", credentials);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const createClient = createAsyncThunk(
  "auth/createClient",
  async (clientData, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/admin/create-user", clientData);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create client",
      );
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

export const refreshProfile = createAsyncThunk(
  "auth/refreshProfile",
  async ({ id, role }, { rejectWithValue }) => {

    if (
      role.toLowerCase() == "trainer" ||
      role.toLowerCase() == "dietician" ||
      role.toLowerCase() == "therapist"
    ) {
      role = "expert";
    }
    try {
      let endpoint;

      switch (role) {
        case "admin":
          endpoint = `/admin/admin-profile/${id}`;
          break;
        case "user":
          endpoint = `/clients/get-client/${id}`;
          break;
        case "expert":
          endpoint = `/coach/get-coach/${id}`;
          break;
        case "head":
          endpoint = `/heads/get-head/${id}`;
          break;
        case "founder":
          endpoint = `/founder/founder-profile/${id}`;
          break;
      }
      const data = await axiosInstance.get(endpoint);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh profile",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/auth/forgot-password", { email });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP",
      );
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/auth/verify-otp", { email, otp });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password",
      );
    }
  },
);

export const editProfile = createAsyncThunk(
  "auth/editProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.patch("/auth/edit-profile", profileData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit profile",
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.put(
        "/auth/change-password",
        passwordData,
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change password",
      );
    }
  },
);
