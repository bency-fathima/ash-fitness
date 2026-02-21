import { createSlice } from "@reduxjs/toolkit";
import { getAllBroadcast, getBroadcast } from "./broadcast.thunk";


const initialState = {
  allBroadcast: [],
  broadcast: null,
  totalBroadcast:0,
  selectedBroadcast: null,
  error: null,
  status: "idle",
};

const BroadcastSlice = createSlice({
  name: "broadcast",
  initialState,
  reducers: {
    clearBroadcastError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBroadcast.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllBroadcast.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allBroadcast = action.payload.data?.broadcast;
        state.totalBroadcast = action.payload.data?.totalCount;
        state.error = null;
      })
      .addCase(getAllBroadcast.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getBroadcast.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getBroadcast.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.broadcast = action.payload.data;
        state.error = null;
      })
      .addCase(getBroadcast.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
      
  },
});

export const { clearCategoryError } = BroadcastSlice.actions;
export default BroadcastSlice.reducer;
