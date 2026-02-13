'use client';

import { use } from 'react';
import PageTitle from '@/components/layouts/PageHeader';
import MaintenanceList from '@/components/modules/tickets/maintenance/MaintenanceList';

export default function MaintenancePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const query = resolvedSearchParams.q || '';

  return (
    <div className="min-h-screen bg-[#FDFCFF] p-6 md:p-8">
      {/* Container */}
      <div className="max-w-7xl mx-auto space-y-6">
        <PageTitle
          title="Manajemen Pemeliharaan"
          description="Kelola jadwal pemeliharaan jaringan dan perangkat."
          actionButton={{
            link: '/operational/tickets/maintenance/create',
            label: 'Jadwal Baru',
            icon:
          }}
        />

        {/* Wrapper animasi in */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <MaintenanceList query={query} />
        </div>
      </div>
    </div>
  );
}
