import { combineReducers } from '@reduxjs/toolkit';
import navbarReducer from './features/todo-slice';
const rootReducer = combineReducers({
  counter: navbarReducer,
});
export default rootReducer;