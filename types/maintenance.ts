// types/maintenance.ts
import { MaintenanceFormValues } from '@/schemas/maintenanceSchema';

// Tipe untuk satu item log di Timeline
export interface TicketUpdateLog {
  id: string;
  date: string; // ISO String
  user: string;
  status: string;
  description: string;
  images?: string[];
}

// Tipe Utama (Gabungan Data Form + System Fields)
export interface MaintenanceTicket extends MaintenanceFormValues {
  id: string;
  status: 'Scheduled' | 'open' | 'process' | 'closed' | 'pending';
  createdAt: string;
  updatedAt: string;

  // Array ini WAJIB ada di tipe agar Timeline muncul
  updates: TicketUpdateLog[];
}
