export interface TicketUpdate {
  id: string;
  penjelasan: string;
  tanggal: string;
  user: string;
}

export interface Ticket {
  id: number | string;
  title: string;
  description: string;
  status: 'open' | 'process' | 'closed';
  image?: string | null;
  createdAt: string;
  updatedAt?: string;
  updates: TicketUpdate[]; // Array untuk tracking timeline
}
