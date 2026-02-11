export interface TicketTroubleUpdate {
  id: string;
  ticketId: number | string; // Foreign Key
  description: string;
  date: string;
  user: string;
  images: string[];
  status: 'open' | 'process' | 'closed';
}

export interface TicketTrouble {
  id: number | string;

  title: string;
  siteId: string;
  description: string;
  status: 'open' | 'process' | 'closed';
  priority: 'Critical' | 'Major' | 'Minor';
  images: string[];

  startTime: string;
  runHours: string;
  statusTx: string;
  duration: string;

  reporters: string[]; // Array nama teknisi/pelapor (Multi-select + External)

  createdAt: string;
  updatedAt?: string;
  updates: TicketTroubleUpdate[];
}
