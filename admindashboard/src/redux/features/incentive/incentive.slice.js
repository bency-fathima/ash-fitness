import { createSlice } from "@reduxjs/toolkit";
import { createPayroll, getPayroll } from "./incentive.thunk";

const initialState = {
    Payroll: [],
    createdPayroll: null,
    status: "idle",
    error: null,
}

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    clearPayrollError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder)=> {
    builder
      .addCase(createPayroll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPayroll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.createdPayroll = action.payload;
      })
      .addCase(createPayroll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getPayroll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPayroll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.Payroll = action.payload;
      })
      .addCase(getPayroll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { clearPayrollError } = payrollSlice.actions;
export default payrollSlice.reducer;