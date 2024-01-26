import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DuckDBState = {
  data: {};
};

const initialState = {
  data: {},
} as DuckDBState;

export const duckbook = createSlice({
  name: "duckbook",
  initialState,
  reducers: {
    reset: () => initialState,
    setDuckBookState: (state, action) => {
      state.data = action.payload;
    },
    setChangeDuckBookName: (state, action) => {
      let name : any = state.data;
      name["DB_NAME"] = action.payload;
    },
    setChangeDuckBookData : (state,action) => {
      let data : any = state.data;
      data["DATA"] = action.payload;
    }
  },
});
export const {
  setDuckBookState,
  setChangeDuckBookName,
  setChangeDuckBookData
} = duckbook.actions;
export default duckbook.reducer;