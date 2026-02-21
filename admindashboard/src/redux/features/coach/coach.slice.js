
import { createSlice } from "@reduxjs/toolkit";
import { createCoach, getAllCoaches, getCoachDashboardStats, getFounderAllCoaches, getSingleCoach, getUsersAssignedToACoach } from "./coach.thunk";
import { getAllCoachesByAdminId } from "../admins/admin.thunk";

const initialState = {
  allCoaches: [],
  assignedClients: [],
  founderCoachList: [],
  coachCount: 0,
  totalClientsCount: 0,
  selectedCoach: null,
  error: null,
  status: "idle",
  dashboardStats: null,
};

const coachSlice = createSlice({
  name: "coach",
  initialState,
  reducers: {
    clearCoach(state) {
      state.allCoaches = [];
      state.selectedCoach = null;
      state.status = "idle"
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      //get all coach slices
      .addCase(getAllCoaches.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllCoaches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allCoaches = action.payload;
        state.error = null;
      })
      .addCase(getAllCoaches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // get a Single Coach
      .addCase(getSingleCoach.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSingleCoach.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCoach = action.payload;
        state.error = null;
      })
      .addCase(getSingleCoach.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.selectedCoach = null;
      })

      // create Coach
      .addCase(createCoach.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCoach.fulfilled, (state) => {
        state.status = "succeeded";
        state.selectedCoach = null;
        state.error = null;
      })
      .addCase(createCoach.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // get all coaches by admin id
      .addCase(getAllCoachesByAdminId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllCoachesByAdminId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allCoaches = action.payload;
        state.error = null;
      })
      .addCase(getAllCoachesByAdminId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getUsersAssignedToACoach.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsersAssignedToACoach.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignedClients = action.payload.data;
        state.totalClientsCount = action.payload.total;
        state.error = null;
      })
      .addCase(getUsersAssignedToACoach.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getFounderAllCoaches.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFounderAllCoaches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.founderCoachList = action.payload.data.data;
        state.coachCount = action.payload.data.totalCount;
        state.error = null;
      })
      .addCase(getFounderAllCoaches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Dashboard Stats
      .addCase(getCoachDashboardStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCoachDashboardStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardStats = action.payload;
        state.error = null;
      })
      .addCase(getCoachDashboardStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

  },
});

export const { clearCoach } = coachSlice.actions;
export default coachSlice.reducer;
