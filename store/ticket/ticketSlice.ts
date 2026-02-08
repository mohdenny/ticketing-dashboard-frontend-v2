// src/store/ticket/ticketSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ticket } from '@/types/ticket';

type TicketState = {
  items: Ticket[];
};

const initialState: TicketState = {
  items: [],
};

const slice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    hydrateTickets(state, action: PayloadAction<Ticket[]>) {
      state.items = action.payload;
    },
    optimisticAdd(state, action: PayloadAction<Ticket>) {
      state.items.unshift(action.payload);
    },
  },
});

export const { hydrateTickets, optimisticAdd } = slice.actions;
export default slice.reducer;
