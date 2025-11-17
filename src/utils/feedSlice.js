import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeFeed: () => null,
    removeOneUserFromFeed: (state, action) => {
      const newFeed = state.filter((user) => user._id !== action.payload);
      return newFeed;
    },
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      return state.map((user) => (user._id === userId ? { ...user, connectionStatus: status } : user));
    },
  },
});

export const { addFeed, removeFeed, removeOneUserFromFeed, updateUserStatus } = feedSlice.actions;
export default feedSlice.reducer;
