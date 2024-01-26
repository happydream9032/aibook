import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DuckDBState = {
  data: [];
};

const initialState = {
  data: [],
} as DuckDBState;

export const duckbooklist = createSlice({
  name: "duckbooklist",
  initialState,
  reducers: {
    reset: () => initialState,
    setDuckBookListState: (state, action) => {
      state.data = action.payload;
    },
  },
});
export const {
  setDuckBookListState
} = duckbooklist.actions;
export default duckbooklist.reducer;