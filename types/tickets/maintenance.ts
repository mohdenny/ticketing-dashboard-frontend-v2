import { MaintenanceFormValues } from '@/schemas/tickets/maintenance';

export interface MaintenanceUpdate {
  id: string;
  date: string; // ISO String
  user: string;
  status: string;
  description: string;
  images?: string[];
}

export interface MaintenanceTicket extends MaintenanceFormValues {
  id: string;
  status: 'Scheduled' | 'open' | 'process' | 'closed' | 'pending';
  createdAt: string;
  updatedAt: string;

  updates: MaintenanceUpdate[];
}
