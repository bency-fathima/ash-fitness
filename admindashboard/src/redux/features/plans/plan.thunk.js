import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createNewPlan = createAsyncThunk("plans/createNewPlan", async (planData, { rejectWithValue }) => {
    try {
        const data = await axiosInstance.post("/plans/create-plan", planData, { rejectWithValue })
        return data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create new plan");
    }
})

export const getPlanById = createAsyncThunk("plans/getPlanById", async (planId, { rejectWithValue }) => {
    try {
        const data = await axiosInstance.get(`/plans/get-plan-by-id/${planId}`, { rejectWithValue })
        return data.data
    } catch (error) {
        
        return rejectWithValue(error.response?.data?.message || "Failed to fetch plan");
    }
})

export const getPlanByProgramId = createAsyncThunk("plans/getPlanByProgramId", async (programId, { rejectWithValue }) => {
    try {
        const data = await axiosInstance.get(`/plans/get-plan-by-programId/${programId}`, { rejectWithValue })
        return data.data
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch plan");
    }
})

export const updatePlan = createAsyncThunk(
    "plans/updatePlan",
    async ({ planId, planData }, { rejectWithValue }) => {
        try {
            const data = await axiosInstance.put(`/plans/update-plan/${planId}`, planData);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update plan"
            );
        }
    }
);

export const deletePlan = createAsyncThunk(
    "plans/deletePlan",
    async (planId, { rejectWithValue }) => {
        try {
            const data = await axiosInstance.delete(`/plans/delete-plan/${planId}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete plan"
            );
        }
    }
);


export const uploadPlanMedia = createAsyncThunk(
    "plans/uploadMedia",
    async ({ formData, onUploadProgress }, { rejectWithValue }) => {
        try {
            // axiosInstance interceptor returns response.data, so we just capture that
            const data = await axiosInstance.post("/plans/upload-media", formData, {
                headers: {
                    // "Content-Type": "multipart/form-data", // Let browser set boundary
                },
                onUploadProgress,
            });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to upload media"
            );
        }
    }
);