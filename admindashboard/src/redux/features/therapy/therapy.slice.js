import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTherapyPlans,
  getTherapyPlanById,
  updateTherapyPlan,
  deleteTherapyPlan,
} from "./therapy.thunk";

const initialState = {
  plans: [],        // all therapy plans (for dropdown, listing)
  plan: null,       // single therapy plan (for client dashboard)
  plansCount: 0,
  loading: false,
  error: null,
};

const therapySlice = createSlice({
  name: "therapy",
  initialState,
  reducers: {
    clearTherapyPlan(state) {
      state.plan = null;
    },
  },
  extraReducers: (builder) => {
    builder

      
      .addCase(fetchTherapyPlans.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchTherapyPlans.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.plans = action.payload?.data?.therapy || [];
        state.plansCount = action.payload?.data?.totalTherapy || 0;
        state.assignedUsersCount = action.payload?.data?.users || 0;
      })
      .addCase(fetchTherapyPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })

      
       .addCase(getTherapyPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTherapyPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.plan = action.payload?.data || null;
      })
      .addCase(getTherapyPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
      
      .addCase(updateTherapyPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTherapyPlan.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPlan = action.payload.data;
        state.plans = state.plans.map(plan => 
          plan._id === updatedPlan?._id ? updatedPlan : plan
        );
         if (state.plan && state.plan?._id === updatedPlan?._id) {
            state.plan = updatedPlan;
        }
      })
      .addCase(updateTherapyPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })

      .addCase(deleteTherapyPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTherapyPlan.fulfilled, (state, action) => {
        state.loading = false;
        const { planId } = action.payload; // Since the thunk returns { planId, ... }
        state.plans = state.plans.filter(plan => plan._id !== planId);
        state.plansCount -= 1;
      })
      .addCase(deleteTherapyPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export const { clearTherapyPlan } = therapySlice.actions;
export default therapySlice.reducer;
