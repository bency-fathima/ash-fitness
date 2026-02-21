import { createSlice } from "@reduxjs/toolkit";
import { uploadTask, getUserTaskStatus, getPendingSubmissions, verifyTask, rejectTask, getAllUserSubmissions } from "./task.thunk";

const initialState = {
    tasks: [], // List of submitted tasks for client
    pendingTasks: [], // For expert review
    selectedUserTasks: [], // For expert viewing specific client history
    loading: false,
    error: null,
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        clearTaskError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Upload Task
            .addCase(uploadTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadTask.fulfilled, (state, action) => {
                state.loading = false;
                if (!action.payload) return;

                // Update or add the task in the list
                const index = state.tasks.findIndex(
                    (t) =>
                        t.globalDayIndex === action.payload.globalDayIndex &&
                        t.exerciseIndex === action.payload.exerciseIndex
                );
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                } else {
                    state.tasks.push(action.payload);
                }
            })
            .addCase(uploadTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get User Task Status
            .addCase(getUserTaskStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserTaskStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload || [];
            })
            .addCase(getUserTaskStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Pending Submissions
            .addCase(getPendingSubmissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPendingSubmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingTasks = action.payload || [];
            })
            .addCase(getPendingSubmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Failed to fetch pending submissions:", action.payload);
            })
            // Get All User Submissions
            .addCase(getAllUserSubmissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllUserSubmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUserTasks = action.payload || [];
            })
            .addCase(getAllUserSubmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verify Task
            .addCase(verifyTask.fulfilled, (state, action) => {
                // Remove from pendingTasks
                state.pendingTasks = state.pendingTasks.filter(
                    (t) => t._id !== action.meta.arg
                );
                // Update in selectedUserTasks
                const task = state.selectedUserTasks.find(t => t._id === action.meta.arg);
                if (task) {
                    task.status = "verified";
                }
            })
            // Reject Task
            .addCase(rejectTask.fulfilled, (state, action) => {
                // Remove from pendingTasks
                state.pendingTasks = state.pendingTasks.filter(
                    (t) => t._id !== action.meta.arg.id
                );
                // Update in selectedUserTasks
                const task = state.selectedUserTasks.find(t => t._id === action.meta.arg.id);
                if (task) {
                    task.status = "rejected";
                }
            });
    },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
