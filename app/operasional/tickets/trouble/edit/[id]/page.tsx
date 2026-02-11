'use client';

import { use } from 'react';
import TicketTroubleList from '@/components/modules/tickets/trouble/TicketTroubleList';
import PageTitle from '@/components/layouts/PageTitle';

export default function TicketTroublePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Unwrapping searchParams secara aman sesuai standar Next.js terbaru
  const resolvedSearchParams = use(searchParams);
  const query = resolvedSearchParams.q || '';

  return (
    // M3 Standard: Menggunakan Background (#FDFCFF) agar kontras dengan Surface Container (#FEF7FF) pada komponen List
    <div className="min-h-screen bg-[#FDFCFF] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageTitle
          title="Manajemen Tiket"
          description="Semua laporan dukungan operasional dalam satu tempat."
          actionButton={{
            link: '/operasional/tickets/trouble/create',
            label: 'Buat Tiket',
          }}
        />

        {/* Standardisasi:
          Div ini hanya sebagai layout wrapper.
          Styling card/border dihapus karena sudah ditangani di dalam component <TicketTroubleList />
        */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TicketTroubleList query={query} />
        </div>
      </div>
    </div>
  );
}
