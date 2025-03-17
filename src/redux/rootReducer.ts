// rootReducer.ts
import {combineReducers} from '@reduxjs/toolkit';
import userSlice from './slice/userSlice';
import chatSlice from './slice/chatSlice';

const rootReducer = combineReducers({
  user: userSlice,
  chat: chatSlice,
});

export default rootReducer;
