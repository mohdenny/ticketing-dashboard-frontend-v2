'use client';

import TicketTroubleForm from '@/components/modules/tickets/trouble/TicketTroubleForm';
import { useTickets } from '@/hooks/useTickets';
import { useRouter } from 'next/navigation';
import { TicketTroubleFormValues } from '@/schemas/ticketTroubleSchema';
import { CancelAction } from '@/components/layouts/CancelAction';

export default function CreateTicketPage() {
  const router = useRouter();
  const { createTicket, isProcessing } = useTickets();

  const handleCreateSubmit = async (data: TicketTroubleFormValues) => {
    try {
      await createTicket(data);
      // Jika berhasil, arahkan kembali ke daftar tiket
      router.push('/operasional/tickets/trouble');
      router.refresh();
    } catch (error) {
      console.error('Gagal membuat tiket:', error);
      alert('Gagal membuat tiket, silakan coba lagi.');
    }
  };

  return (
    <div className="max-w-2xl lg:max-w-full mx-auto p-6">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Buat Tiket Baru</h1>
            <p className="text-gray-500">
              Isi detail keluhan atau permintaan bantuan Anda.
            </p>
          </div>
          <CancelAction
            link="/operasional/tickets/trouble"
            label="Batal & Kembali"
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border-gray-100 shadow-sm">
        <TicketTroubleForm
          onSubmit={handleCreateSubmit}
          isLoading={isProcessing}
        />
      </div>
    </div>
  );
}
