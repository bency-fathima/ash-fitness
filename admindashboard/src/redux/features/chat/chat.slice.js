import { createSlice } from "@reduxjs/toolkit";
import { getChats } from "./chat.thunk";

const initialState = {
  chats: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChat(state) {
      state.error = null;
      state.status="idle",
      state.chats = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chats = action.payload;
        state.error = null;
      })
      .addCase(getChats.rejected, (state, action) => {
        state.status ="failed"
        state.chats = null
        state.error= action.payload
      })
    },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;
