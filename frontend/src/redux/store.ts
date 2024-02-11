import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./features/todo-slice";
import navbarReducer from "./features/navbar-slice";
import navbarlistReducer from './features/navbarlist-slice';
import userReducer from './features/user-slice';

export const store = configureStore({
  reducer: { todoReducer, navbarReducer, navbarlistReducer, userReducer },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;