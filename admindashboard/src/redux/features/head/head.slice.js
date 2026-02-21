import { createSlice } from "@reduxjs/toolkit";
import { createHead, getAllHeads, getFounderAllHeads, getHead, getDashboardData } from "./head.thunk";

const initialState = {
  allHeads: [],
  founderHeadList: [],
  headCount: 0,
  createHead: null,
  head: null,
  dashboardData: null,
  status: "idle",
  error: null,
};

const headSlice = createSlice({
  name: "head",
  initialState,

  reducers: {
    clearHeadError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createHead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createHead.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.createHead = action.payload;
        state.error = null;
      })
      .addCase(createHead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getAllHeads.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllHeads.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allHeads = action.payload.data.head;
        state.headCount = action.payload.data.totalCount;
      })
      .addCase(getAllHeads.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getHead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getHead.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.head = action.payload;
        state.error = null;
      })
      .addCase(getHead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getFounderAllHeads.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFounderAllHeads.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.founderHeadList = action.payload.data.data;
        state.headCount = action.payload.data.totalCount;
        state.error = null;
      })
      .addCase(getFounderAllHeads.rejected, (state, action) => {
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

export const { clearHeadError } = headSlice.actions;
export default headSlice.reducer;
