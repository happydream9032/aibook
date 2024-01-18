import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type GPTState = {
  type: boolean;
};

const initialState = {
  type: false,
} as GPTState;

export const todo = createSlice({
  name: "counter",
  initialState,
  reducers: {
    reset: () => initialState,
    setgpt3_5: (state) => {
      state.type = true;
    },
    setgpt4: (state) => {
      state.type = false;
    },
  },
});
export const {
  setgpt3_5,
  setgpt4,
  reset,
} = todo.actions;
export default todo.reducer;