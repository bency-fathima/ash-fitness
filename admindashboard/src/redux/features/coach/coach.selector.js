export const selectAllCoaches = (state) => state.coach.allCoaches;
export const selectFounderAllCoaches = (state) => state.coach.founderCoachList;
export const selectCoachCount = (state) => state.coach.coachCount;
export const selectCoachById = (state) => state.coach.selectedCoach;
export const selectCoachError = (state) => state.coach.error;
export const selectCoachStatus = (state) => state.coach.status;

export const selectAssignedClients = (state) => state.coach.assignedClients;
export const selectTotalClientsCount = (state) => state.coach.totalClientsCount;
export const selectCoachDashboardStats = (state) => state.coach.dashboardStats;