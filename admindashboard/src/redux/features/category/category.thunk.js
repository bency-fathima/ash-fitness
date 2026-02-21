import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createCategory = createAsyncThunk(
  "category/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/category/create",
        categoryData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "creating category failed",
      );
    }
  },
);

export const getCategory = createAsyncThunk(
  "category/list/:catId",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`category/list/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get categories",
      );
    }
  },
);

export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/category/list/${page}/${limit}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get categories",
      );
    }
  },
);

export const updateCategories = createAsyncThunk(
  "category/update",
  async ( {id, updatedData} , { rejectWithValue }) => {
    try {
      const data = await axiosInstance.put(
        `/category/update/${id}`,
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

export const deleteCategory = createAsyncThunk(
  "category/list/:id",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.delete(`/category/delete/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete category",
        },
      );
    }
  },
);

export const getFounderCategories = createAsyncThunk(
  "category/founder/list",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/category/founder/list/${page}/${limit}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get categories",
      );
    }
  },
);