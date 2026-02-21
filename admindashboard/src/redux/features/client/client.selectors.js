export const selectAllClients = (state) => state.client.allClients;
export const selectFounderAllClients = (state) =>
  state.client.founderClientList;
export const selectSelectedClient = (state) => state.client.selectedClient;
export const selectClientError = (state) => state.client.error;
export const selectClientStatus = (state) => state.client.status;
export const selectTotalClientCount = (state) => state.client.totalCount;
export const selectWeightHistory = (state) => state.client.weightHistory;
export const selectCurrentWeight = (state) => state.client.currentWeight;
 export const selectClientsWithHabitPlan = (state) =>
  state.client.clientsWithHabitPlan || [];
