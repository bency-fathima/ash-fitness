import { createSlice } from "@reduxjs/toolkit";
import { founderDashboardData } from "./founder.thunk";

const initialState = {
  founderDashBoard: null,
  status: "idle",
  error: null,
};

const founderSlice = createSlice({
  name: "founder",
  initialState,

  reducers: {
    clearFounderError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(founderDashboardData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(founderDashboardData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.founderDashBoard = action.payload;
      })
      .addCase(founderDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export const { clearFounderError } = founderSlice.actions;
export default founderSlice.reducer;
