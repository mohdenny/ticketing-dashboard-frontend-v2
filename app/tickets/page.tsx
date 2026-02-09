'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import TicketList from '@/components/TicketList';

// Kita asumsikan 'query' dikelola di Layout atau Header
// dan diteruskan sebagai props atau diambil dari searchParams
export default function TicketsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen bg-[#FEF7FF]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-[32px] font-medium text-[#1C1B1F] tracking-tight">
            Manajemen Tiket
          </h1>
          <p className="text-[#49454F] mt-1 text-base">
            Semua laporan dukungan Anda dalam satu tempat.
          </p>
        </div>

        <Link
          href="/tickets/create"
          className="flex items-center justify-center gap-3 bg-[#6750A4] text-white px-6 py-4 rounded-[16px] font-medium shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          <Plus size={20} /> Buat Tiket
        </Link>
      </div>

      {/* Konten Utama */}
      <div className="bg-[#F7F2FA] rounded-[32px] p-6 border border-[#E6E0E9]">
        {/* Memanggil TicketList yang sudah sinkron dengan label Edited */}
        <TicketList query={query} />
      </div>
    </div>
  );
}
