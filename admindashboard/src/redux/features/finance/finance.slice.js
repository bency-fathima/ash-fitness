import { createSlice } from "@reduxjs/toolkit";
import { getAllEmployeeHistory, getAllEmployees } from "./finance.thunk";

const initialState = {
  allEmployees: [],
  employeeHistory: [],
  employeeCount: 0,
  allEmployeeCount: 0,
  totalSalary: 0,
  totalBaseSalary: 0,
  totalIncentive: 0,
  error: null,
  status: "idle",
};

const employeeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    clearEmployeeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEmployees.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allEmployees = action?.payload?.data?.employees;
        state.allEmployeeCount = action?.payload?.data?.employeeCount;
        state.totalSalary = action?.payload?.data?.totalSalary;
        state.totalBaseSalary = action?.payload?.data?.totalBaseSalary;
        state.totalIncentive = action?.payload?.data?.totalIncentive;
        state.error = null;
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllEmployeeHistory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllEmployeeHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employeeHistory = action?.payload?.data?.data;
        state.employeeCount = action?.payload?.data?.totalCount;
        state.error = null;
      })
      .addCase(getAllEmployeeHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearEmployeeError } = employeeSlice.actions;
export default employeeSlice.reducer;
