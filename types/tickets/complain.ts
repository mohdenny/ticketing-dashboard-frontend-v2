export interface Complain {
  id: number | string;
  site: string;
  reporters: string[];
  status: 'open' | 'process' | 'closed';
  createdAt: string;
}
