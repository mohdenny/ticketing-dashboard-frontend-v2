'use client';

import { use } from 'react';
import TicketTroubleList from '@/components/modules/tickets/trouble/TicketTroubleList';
import PageTitle from '@/components/layouts/PageTitle';

export default function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const query = resolvedSearchParams.q || '';

  return (
    <div className="min-h-screen bg-[#FDFCFF] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageTitle
          title="Manajemen Tiket Kendala"
          description="Semua laporan dukungan operasional dalam satu tempat."
          actionButton={{
            link: '/operasional/tickets/trouble/create',
            label: 'Buat Tiket',
          }}
        />

        {/* Wrapper animasi in*/}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TicketTroubleList query={query} />
        </div>
      </div>
    </div>
  );
}
