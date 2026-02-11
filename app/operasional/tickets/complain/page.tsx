'use client';

import { use } from 'react';
import PageTitle from '@/components/layouts/PageTitle';
import ComplainList from '@/components/modules/tickets/complain/ComplainList';

export default function ComplainPage({
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
          title="Menejemen Komplain Pemirsa"
          description="Pantau dan tindak lanjuti laporan gangguan serta keluhan layanan dari pemirsa."
        />

        {/* Wrapper animasi in */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ComplainList query={query} />
        </div>
      </div>
    </div>
  );
}
