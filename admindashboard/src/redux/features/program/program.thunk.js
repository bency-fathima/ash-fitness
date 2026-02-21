import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createProgram = createAsyncThunk(
  "program/createProgram",
  async (programDetails, { rejectWithValue }) => {
    try {
      const config =
        programDetails instanceof FormData
          ? {
              headers: {
                // "Content-Type": "multipart/form-data",
              },
            }
          : {};

      const response = await axiosInstance.post(
        `/programs/create`,
        programDetails,
        config
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to Create Program",
      );
    }
  }
);

export const getAllPrograms = createAsyncThunk(
  "program/getAllPrograms",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/programs/list/${page}/${limit}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get programs"
      );
    }
  }
);
export const getProgramById = createAsyncThunk(
  "program/getProgramById",
  async (programId, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/programs/get/${programId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get program by id"
      );
    }
  }
);

export const updateProgram = createAsyncThunk(
  "program/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.put(
        `/programs/update/${id}`,
        updatedData,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get categories",
      );
    }
  },
);

export const deleteProgram = createAsyncThunk(
  "program/delete/:id",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.delete(`/programs/delete/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete program",
        },
      );
    }
  },
);

export const getAllProgramsByCategory = createAsyncThunk(
  "program/getAllProgramsByCategory",
  async ({ category, page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/programs/get-all-programs-by-category/${category}/${page}/${limit}`
      );
      return data;
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get programs by category"
      );
    }
  }
);

export const getAllProgramsByExpertId = createAsyncThunk(
  "program/getAllProgramsByExpertId",
  async ({ expertId, page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/programs/get-all-programs-by-expert/${expertId}/${page}/${limit}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get programs by expert id"
      );
    }
  }
);

export const getAllProgramsByAdmin = createAsyncThunk(
  "program/getAllProgramsByAdmin",
  async ({ adminId, page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/programs/get-all-programs-by-admin/${adminId}/${page}/${limit}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get programs by admin id"
      );
    }
  }
);

export const getFounderPrograms = createAsyncThunk(
  "/programs/founder/list",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/programs/founder/list/${page}/${limit}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get programs",
      );
    }
  },
);
