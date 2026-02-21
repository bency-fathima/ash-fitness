import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const uploadTask = createAsyncThunk(
    "tasks/uploadTask",
    async (formData, { rejectWithValue }) => {
        try {
            const body = await axiosInstance.post("/tasks/submit", formData);
            return body.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to upload task"
            );
        }
    }
);

export const uploadMultipleWorkoutTasks = createAsyncThunk(
    "tasks/uploadMultipleWorkoutTasks",
    async (formData, { rejectWithValue }) => {
        try {
            const body = await axiosInstance.post("/tasks/submit-multiple-workouts", formData);
            return body.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to upload workout tasks"
            );
        }
    }
);

export const getUserTaskStatus = createAsyncThunk(
    "tasks/getUserTaskStatus",
    async (_, { rejectWithValue }) => {
        try {
            const body = await axiosInstance.get("/tasks/my-status");
            return body.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch task status"
            );
        }
    }
);

export const getPendingSubmissions = createAsyncThunk(
    "tasks/getPendingSubmissions",
    async (_, { rejectWithValue }) => {
        try {
            const body = await axiosInstance.get("/tasks/pending");
            return body.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch pending submissions"
            );
        }
    }
);

export const verifyTask = createAsyncThunk(
    "tasks/verifyTask",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`/tasks/${id}/verify`);
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to verify task"
            );
        }
    }
);

export const rejectTask = createAsyncThunk(
    "tasks/rejectTask",
    async ({ id, comment }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`/tasks/${id}/reject`, { comment });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to reject task"
            );
        }
    }
);

export const getAllUserSubmissions = createAsyncThunk(
    "tasks/getAllUserSubmissions",
    async (userId, { rejectWithValue }) => {
        try {
            const body = await axiosInstance.get(`/tasks/user/${userId}/all`);
            return body.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch user submissions"
            );
        }
    }
);


