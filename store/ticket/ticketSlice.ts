import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ticket } from '@/types/ticket';

type TicketState = {
  items: Ticket[];
};

const initialState: TicketState = {
  items: [],
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    setTickets(state, action: PayloadAction<Ticket[]>) {
      state.items = action.payload;
    },
    addTicket(state, action: PayloadAction<Ticket>) {
      state.items.unshift(action.payload);
    },
  },
});

export const { setTickets, addTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
