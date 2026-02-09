'use client';

import { use } from 'react';
import TicketList from '@/components/TicketList';
import PageHeader from '@/components/PageHeader';

export default function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const query = resolvedSearchParams.q || '';

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto lg:max-w-full min-h-screen bg-[#FEF7FF]">
      <PageHeader
        title="Manajemen Tiket"
        caption="Semua laporan dukungan Anda dalam satu tempat."
        label="Buat Tiket"
      />

      <div className="bg-[#F7F2FA] rounded-[32px] p-6 border border-[#E6E0E9]">
        <TicketList query={query} />
      </div>
    </div>
  );
}
