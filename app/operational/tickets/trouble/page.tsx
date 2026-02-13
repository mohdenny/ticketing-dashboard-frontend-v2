'use client';

import { use } from 'react';
import { Plus } from 'lucide-react';
import TicketTroubleList from '@/components/modules/tickets/trouble/TroubleList';
import PageHeader from '@/components/layouts/PageHeader';
import PageContainer from '@/components/layouts/PageContainer';

export default function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const query = resolvedSearchParams.q || '';

  return (
    <PageContainer variant="primary">
      <PageHeader
        title="Manajemen Tiket Kendala"
        description="Semua laporan dukungan operational dalam satu tempat."
        actionButton={{
          link: '/operational/tickets/trouble/create',
          label: 'Buat Tiket',
          icon: Plus,
        }}
      />

      {/* Wrapper animasi in*/}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TicketTroubleList query={query} />
      </div>
    </PageContainer>
  );
}
