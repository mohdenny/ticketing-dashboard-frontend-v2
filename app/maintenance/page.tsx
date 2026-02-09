'use client';

import PageHeader from '@/components/PageHeader';
import DataList from '@/components/DataList';

export default function MaintenancePage() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto lg:max-w-full min-h-screen bg-[#FEF7FF]">
      <PageHeader
        title="Manajemen Perawatan"
        caption="Semua laporan perawatan Anda dalam satu tempat."
        label="Buat "
      />

      <div className="bg-[#F7F2FA] rounded-[32px] p-6 border border-[#E6E0E9]">
        <DataList />
      </div>
    </div>
  );
}
