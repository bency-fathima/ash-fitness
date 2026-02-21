import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";



export const getAllClients = createAsyncThunk(
  "client/getAllClients",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/clients/all-clients/${page}/${limit}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get clients");
    }
  }
);

export const getClient = createAsyncThunk(
  "client/getClient",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/clients/get-client/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get client");
    }
  }
);

export const getClientsBasedOnCoach = createAsyncThunk(
  "client/getClientsBasedOnCoach",
  async ({ coachIds, page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post(`/clients/get-all-users-based-on-coach-for-admin`, { coachIds, page, limit });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get clients");
    }
  }
);

export const createFeedback = createAsyncThunk(
  "client/createFeedback",
  async (values, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.put(`/coach/feedback`, values);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create feedback");
    }
  }
);

export const assignDietPlan = createAsyncThunk(
  "client/assignDietPlan",
  async ({ clientId, formData }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post(
        `/clients/assign-diet-plan/${clientId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign diet plan",
      );
    }
  },
);

export const getAllFeedbacks = createAsyncThunk(
  "client/getAllFeedbacks",
  async ({ id, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/clients/get-all-feedbacks/${id}?page=${page}&limit=${limit}`
      );
      return data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get feedbacks"
      );
    }
  }
);




export const updateWeightOfClient = createAsyncThunk("client/updateWeight", async ({ id, currentWeight }, { rejectWithValue }) => {
  try {
    const data = await axiosInstance.put(`clients/${id}/weight`, { currentWeight })
    return data.data

  }
  catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update weight")
  }
})


export const updateClientStatus = createAsyncThunk(
  "client/updateClientStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/clients/update-client/${id}`, {
        status,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update client status",
      );
    }
  },
);



export const updateMeasurementOfClient = createAsyncThunk("client/updateMeasurement", async ({ id, chest, waist, hip }, { rejectWithValue }) => {
  try {
    const data = await axiosInstance.put(`clients/${id}/measurements`, { chest, waist, hip })
    return data.data
  }
  catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update measurement")
  }
})


export const fetchClientWeightHistory = createAsyncThunk(
  "client/fetchClientWeightHistory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get("/clients/weight-history");

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch weight history"
      );
    }
  }
);

export const fetchClientComplianceStats = createAsyncThunk(
  "client/fetchClientComplianceStats",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/clients/compliance-stats?userId=${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch compliance stats"
      );
    }
  }
);

export const fetchClientMeasurementHistory = createAsyncThunk(
  "client/fetchClientMeasurementHistory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get("/clients/measurement-history");

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch measurement history"
      );
    }
  }
); 

export const getFounderAllClients = createAsyncThunk(
  "/clients/founder/list",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(
        `/clients/founder/list/${page}/${limit}`,
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get clients",
      );
    }
  },
);



export const getClientsWithHabitPlanThunk = createAsyncThunk(
  "clients/getWithHabitPlan",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/clients/clients");
       
      return res.data; 
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch clients"
      );
    }
  }
);

export const deleteClient = createAsyncThunk(
  "client/deleteClient",
  async ({ id }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.delete(`/clients/delete-client/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete client"
      );
    }
  }
);

export const updateClient = createAsyncThunk(
  "client/updateClient",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.post(`/clients/update-client/${id}`, values);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update client"
      );
    }
  }
);



