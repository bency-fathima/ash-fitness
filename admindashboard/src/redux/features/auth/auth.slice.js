// features/auth/auth.slice.js
import { createSlice } from "@reduxjs/toolkit";
import { createClient, login, logout, refreshProfile } from "./auth.thunk";
import { clearChat } from "../chat/chat.slice";
import { clearClient } from "../client/client.slice";
import { clearCoach } from "../coach/coach.slice";

const initialState = {
  user: null,
  token: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createClient.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createClient.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createClient.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        clearChat();
        clearClient()
        clearCoach();
      })
      .addCase(refreshProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
