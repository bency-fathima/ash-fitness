import { createSlice } from "@reduxjs/toolkit";
import {
  fetchClientWeightHistory,
  getAllClients,
  getClient,
  getClientsBasedOnCoach,
  getClientsWithHabitPlanThunk,
  getFounderAllClients,
} from "./client.thunk";

const initialState = {
  allClients: [],
  clientsWithHabitPlan: [], 
  founderClientList: [],
  selectedClient: null,
  weightHistory: [],
  currentWeight: null,
  totalCount: 0,
  error: null,
  status: "idle",
};


const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearClient(state) {
      state.allClients = [];
      state.selectedClient = null;
      state.weightHistory = [];
      state.currentWeight = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllClients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allClients = action.payload.data;
        state.totalCount = action.payload.totalCount;
        state.error = null;
      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getClient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getClient.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedClient = action.payload;
        state.error = null;
      })
      .addCase(getClient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getClientsBasedOnCoach.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getClientsBasedOnCoach.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allClients = action.payload.data;
        state.error = null;
      })
      .addCase(getClientsBasedOnCoach.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchClientWeightHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClientWeightHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.weightHistory = action.payload?.weightHistory ?? [];
        state.currentWeight = action.payload?.currentWeight ?? null;
        state.error = null;
      })
      .addCase(fetchClientWeightHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getFounderAllClients.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFounderAllClients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.founderClientList = action.payload.data.data;
        state.totalCount = action.payload.data.totalCount;
        state.error = null;
      })
      .addCase(getFounderAllClients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getClientsWithHabitPlanThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getClientsWithHabitPlanThunk.fulfilled, (state, action) => {
  state.status = "succeeded";
  state.clientsWithHabitPlan = action.payload;
})

      .addCase(getClientsWithHabitPlanThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearClient } = clientSlice.actions;
export default clientSlice.reducer;
