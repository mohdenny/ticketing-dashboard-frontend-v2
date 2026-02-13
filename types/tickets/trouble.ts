export interface TroubleHistory {
  id: string;
  date: string;
  description: string;
  reporters: string[];
  images: string[];
  status: 'open' | 'process' | 'closed';
}

export interface Trouble {
  id: number | string;
  title: string;
  siteId: string;
  description: string;
  priority: 'Critical' | 'Major' | 'Minor';
  startTime: string;
  createdAt: string;

  status: 'open' | 'process' | 'closed';
  runHours?: string;
  statusTx?: string;
  duration?: string;

  reporters: string[]; // Pelapor Awal
  images: string[]; // Foto Kondisi Awal

  updatedAt: string;
  updates: TroubleHistory[]; // Log History
}

export interface UserOption {
  id: number | string;
  name: string;
  role: 'admin' | 'user';
}
