'use client';

import { use } from 'react';
import PageTitle from '@/components/layouts/PageTitle';
import MaintenanceList from '@/components/modules/tickets/maintenance/MaintenanceList';

export default function MaintenanceIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Logic searchParams disamakan dengan TicketsPage agar fitur search berfungsi
  const resolvedSearchParams = use(searchParams);
  const query = resolvedSearchParams.q || '';

  return (
    // M3 Standard: Layout Background & Padding konsisten
    <div className="min-h-screen bg-[#FDFCFF] p-6 md:p-8">
      {/* Container: Max width 7xl agar tabel lebar dan rapi */}
      <div className="max-w-7xl mx-auto space-y-6">
        <PageTitle
          title="Maintenance Ticket"
          description="Kelola jadwal pemeliharaan jaringan dan perangkat."
          actionButton={{
            link: '/operasional/tickets/maintenance/create',
            label: 'Jadwal Baru',
          }}
        />

        {/* Wrapper animasi konsisten */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MaintenanceList query={query} />
        </div>
      </div>
    </div>
  );
}
