import { configureStore } from '@reduxjs/toolkit';
import documentReducer from './documentSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    documents: documentReducer,
    auth: authReducer,
  },
});
