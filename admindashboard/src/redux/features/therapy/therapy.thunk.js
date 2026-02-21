import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createNewPlan = createAsyncThunk("therapy/createNewPlan", async (planData, { rejectWithValue }) => {
    try {
        const data = await axiosInstance.post("/therapy", planData, { rejectWithValue })
        return data.data
     
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to create new plan");
    }
})



export const getTherapyPlanById = createAsyncThunk("therapy/getPlanById", async (planId, { rejectWithValue }) => {
    try {        
        const data = await axiosInstance.get(`/therapy/plan/${planId}`)        
        return data.data
    } catch (error) {
        
        return rejectWithValue(error.response?.data?.message || "Failed to fetch plan");
    }
})

 

export const uploadPlanMedia = createAsyncThunk(
    "therapy/uploadMedia",
    async ({ formData, onUploadProgress }, { rejectWithValue }) => {
        try {
             const data = await axiosInstance.post("/therapy/upload-media", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
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

export const fetchTherapyPlans = createAsyncThunk(
  "therapy/fetchPlans",
  async ({page, limit}, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/therapy/${page}/${limit}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch plans"
      );
    }
  }
);

export const updateTherapyPlan = createAsyncThunk(
  "therapy/updatePlan",
  async ({ id, planData }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.put(`/therapy/${id}`, planData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update plan"
      );
    }
  }
);

export const deleteTherapyPlan = createAsyncThunk(
  "therapy/deletePlan",
  async (planId, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.delete(`/therapy/${planId}`);
      return { planId, ...data.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete plan"
      );
    }
  }
);