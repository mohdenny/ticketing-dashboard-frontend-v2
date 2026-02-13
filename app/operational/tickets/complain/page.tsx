'use client';

import PageTitle from '@/components/layouts/PageHeader';

export default function ComplainPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFF] p-6 md:p-8">
      {/* Container */}
      <div className="max-w-7xl mx-auto space-y-6 border-2">
        <PageTitle
          title="Manajemen Komplain Pemirsa"
          description="Pantau dan tindak lanjuti keluhan dari pemirsa."
          actionButton={{
            link: '/operational/tickets/complain/create',
            label: 'Buat Komplain',
          }}
        />

        {/* Wrapper animasi in */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1>hi</h1>
        </div>
      </div>
    </div>
  );
}
