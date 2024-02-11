import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type USERState = {
  data: {};
};

const initialState = {
  data: {},
} as USERState;

export const userdata = createSlice({
  name: "counter",
  initialState,
  reducers: {
    reset: () => initialState,
    setUserState: (state, action) => {
      state.data = action.payload;
    },
  },
});
export const {
  setUserState,
} = userdata.actions;
export default userdata.reducer;