'use client';

import { use } from 'react';
import TicketTroubleList from '@/components/modules/tickets/trouble/TicketTroubleList';
import PageTitle from '@/components/layouts/PageTitle';

export default function MonitoringTxDigitalPage({
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
          title="Monitoring Grafik NEC 10.9kW – Site Surabaya"
          description="Pantau performa dan log infrastruktur pemancar."
          actionButton={{
            link: '/operasional/tickets/trouble/create',
            label: 'Input Content',
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
