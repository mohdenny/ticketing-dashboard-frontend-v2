/**
 * TICKET TYPE DEFINITION
 * Standar bentuk data tiket yang digunakan di seluruh aplikasi.
 */
export interface Ticket {
  id?: number;
  title: string;
  description: string;
  image?: string;
  status: 'open' | 'process' | 'closed';
  createdAt: string;
  updatedAt?: string;
}
