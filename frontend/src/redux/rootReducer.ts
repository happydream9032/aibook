import { combineReducers } from '@reduxjs/toolkit';
import todoReducer from './features/todo-slice';
import navbarReducer from './features/navbar-slice';
import navbarlistReducer from './features/navbarlist-slice';
const rootReducer = combineReducers({
  counter: todoReducer,
  duckbook : navbarReducer,
  duckbooklist : navbarlistReducer
});
export default rootReducer;