import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user", // name of slice
  initialState: null, //initial value
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: () => {
      return null;
    },
  },
});
export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
