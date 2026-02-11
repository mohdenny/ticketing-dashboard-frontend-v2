// Tipe untuk History / Log Update
export interface TicketTroubleUpdate {
  id: string;
  ticketId: number | string; // Foreign Key relasi ke TicketTrouble
  description: string; // Catatan Pengerjaan (History Note)
  date: string; // Timestamp waktu update
  user: string; // Siapa yang melakukan update (Current User)
  images: string[]; // Foto Update (Max 5)
  status: 'open' | 'process' | 'closed'; // Snapshot status saat update
}

// Tipe Utama Ticket Trouble
export interface TicketTrouble {
  id: number | string;

  // --- Basic Info ---
  title: string; // Judul Masalah
  siteId: string; // [BARU] Site ID (Wajib)
  description: string; // Deskripsi Tambahan
  status: 'open' | 'process' | 'closed';
  priority: 'Critical' | 'Major' | 'Minor'; // Field Priority
  images: string[]; // Lampiran Awal (Main Images)

  // --- Technical Fields ---
  startTime: string; // Waktu Kejadian (datetime-local string)
  runHours: string; // Run Hours Start Genset
  statusTx: string; // Status TX (On Air, Off Air, Degraded)
  duration: string; // Durasi TX-OFF

  // --- Reporters Info ---
  reporters: string[]; // Array nama teknisi/pelapor (Multi-select + External)

  // --- Metadata ---
  createdAt: string;
  updatedAt?: string;
  updates: TicketTroubleUpdate[]; // Array Riwayat Pengerjaan
}
