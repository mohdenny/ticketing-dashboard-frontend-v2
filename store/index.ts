// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import user from './user/userSlice';
import ticket from './ticket/ticketSlice';

export const store = configureStore({
  reducer: { user, ticket },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
