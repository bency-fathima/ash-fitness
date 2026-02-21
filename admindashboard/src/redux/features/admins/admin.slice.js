import { createSlice } from "@reduxjs/toolkit";
import { createAdmin, getAdminProfile, getAllAdmins, getFounderAllAdmins, getDashboardData } from "./admin.thunk";

const initialState = {
  admins: [],
  founderAdminList: [],
  adminCount: 0,
  selectedAdmin: null,
  dashboardData: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminSlice(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAdmins.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllAdmins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admins = action.payload;
        state.error = null;
      })
      .addCase(getAllAdmins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAdminProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedAdmin = action.payload;
        state.error = null;
      })
      .addCase(getAdminProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getFounderAllAdmins.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getFounderAllAdmins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.founderAdminList = action.payload.data.data;
        state.adminCount = action.payload.data.totalCount;
        state.error = null;
      })
      .addCase(getFounderAllAdmins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getDashboardData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardData = action.payload.data ?? action.payload;
        state.error = null;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAdminSlice } = adminSlice.actions;
export default adminSlice.reducer;
