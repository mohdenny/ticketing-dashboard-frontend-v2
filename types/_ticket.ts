export interface TicketUpdate {
  id: string;
  ticketId: number | string; // [BARU] Foreign Key untuk relasi database
  description: string;
  date: string;
  user: string;
  images: string[];
  status: 'open' | 'process' | 'closed'; // Snapshot status saat update ini dibuat
}

export interface Ticket {
  id: number | string;
  title: string;
  description: string;
  status: 'open' | 'process' | 'closed';
  images: string[];
  createdAt: string;
  updatedAt?: string;
  updates: TicketUpdate[];
}
