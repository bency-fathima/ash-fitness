export const selectHabitsList = (state) =>
  state.habit.habitDetails?.habits || [];
