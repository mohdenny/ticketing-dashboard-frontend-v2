'use client';

import { use } from 'react';
import TicketList from '@/components/modules/tickets/TicketList';
import PageTitle from '@/components/layouts/PageTitle';

export default function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Unwrapping searchParams secara aman sesuai standar Next.js terbaru
  const resolvedSearchParams = use(searchParams);
  const query = resolvedSearchParams.q || '';

  return (
    /* Perbaikan: Menggunakan Surface Container Lowest (#FEF7FF) */
    <div className="p-6 md:p-10 max-w-5xl mx-auto lg:max-w-full min-h-screen bg-[#FEF7FF]">
      <PageTitle
        title="Manajemen Tiket"
        description="Semua laporan dukungan Anda dalam satu tempat."
        actionButton={{
          link: '/tickets/create',
          label: 'Buat Tiket',
        }}
      />

      {/* Perbaikan: Menggunakan Surface Container (#F7F2FA) dan Outline Variant (#E6E0E9) */}
      <div className="bg-[#F7F2FA] rounded-[32px] p-6 border border-[#E6E0E9]">
        <TicketList query={query} />
      </div>
    </div>
  );
}
