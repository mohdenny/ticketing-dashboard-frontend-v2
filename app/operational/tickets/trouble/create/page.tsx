'use client';

import { useRouter } from 'next/navigation';
import { useTrouble } from '@/hooks/tickets/useTrouble';
import { TroubleFormValues } from '@/schemas/tickets/trouble';
import TroubleForm from '@/components/modules/tickets/trouble/TroubleForm';
import { CancelAction } from '@/components/layouts/CancelAction';
import PageContainer from '@/components/layouts/PageContainer';

export default function CreateTicketPage() {
  const router = useRouter();
  const { createTicket, isProcessing } = useTrouble();

  const handleCreateSubmit = async (data: TroubleFormValues) => {
    try {
      await createTicket(data);

      // Refresh router untuk memastikan data terbaru terambil jika menggunakan server component di list
      router.refresh();
      router.push('/operational/tickets/trouble');
    } catch (error: any) {
      console.error('Gagal membuat tiket:', error);
      alert(error?.message || 'Gagal membuat tiket, silakan coba lagi.');
    }
  };

  return (
    <PageContainer variant="secondary">
      <div className="flex flex-col lg:flex-row gap-4 lg:justify-between mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Buat Tiket Baru</h1>
          <p className="text-gray-500">
            Isi detail keluhan atau permintaan bantuan Anda.
          </p>
        </div>
        <CancelAction
          link="/operational/tickets/trouble"
          label="Batal & Kembali"
        />
      </div>

      <div className="bg-white p-8 rounded-3xl border-gray-100 shadow-sm">
        <TroubleForm
          onSubmit={handleCreateSubmit}
          isLoading={isProcessing}
          // Mode create, tidak perlu passing defaultValues (atau pass undefined)
        />
      </div>
    </PageContainer>
  );
}
