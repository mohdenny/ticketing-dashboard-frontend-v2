// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import ticketReducer from './ticket/ticketSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    ticket: ticketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
