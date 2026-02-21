import { createSlice } from "@reduxjs/toolkit";
import { createWorkout, getAllWorkout } from "./workout.thunk";


const initialState = {
    allWorkouts: [],
    workout: null,
    status: "idle",
    error: null,
}

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    clearWorkoutError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createWorkout.pending, (state) => {
        state.status = "loading";
    })
    .addCase(createWorkout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.workout = action.payload;
    })
    .addCase(createWorkout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
    })
    .addCase(getAllWorkout.pending, (state) => {
        state.status = "loading";
    })
    .addCase(getAllWorkout.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allWorkouts = action.payload;
    })
    .addCase(getAllWorkout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
    })
  }
});

export const { clearWorkoutError } = workoutSlice.actions;
export default workoutSlice.reducer;