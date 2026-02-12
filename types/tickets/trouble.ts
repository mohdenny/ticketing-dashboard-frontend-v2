// Struktur Item History/Update
export interface TroubleHistory {
  id: string;
  date: string; // ISO String
  description: string;
  reporters: string[]; // Teknisi yang mengerjakan update ini
  images: string[]; // Foto bukti pengerjaan
  status: 'open' | 'process' | 'closed';
}

// Struktur Utama Tiket di Database
export interface Trouble {
  id: number | string;

  // Data Statis (Snapshot saat create)
  title: string;
  siteId: string;
  description: string;
  priority: 'Critical' | 'Major' | 'Minor';
  startTime: string;
  createdAt: string;

  // Data Dinamis (Bisa berubah)
  status: 'open' | 'process' | 'closed';
  runHours?: string;
  statusTx?: string;
  duration?: string;

  // Array
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
