'use client';

import TicketForm from '@/components/TicketForm';
import { useTickets } from '@/hooks/useTickets';
import { useRouter } from 'next/navigation';
import { TicketFormValues } from '@/schemas/ticketSchema';

export default function CreateTicketPage() {
  const router = useRouter();
  const { createTicket, isProcessing } = useTickets();

  const handleCreateSubmit = async (data: TicketFormValues) => {
    try {
      await createTicket(data);
      // Jika berhasil, arahkan kembali ke daftar tiket
      router.push('/tickets');
      router.refresh();
    } catch (error) {
      console.error('Gagal membuat tiket:', error);
      alert('Gagal membuat tiket, silakan coba lagi.');
    }
  };

  return (
    <div className="max-w-2xl lg:max-w-full mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Buat Tiket Baru</h1>
        <p className="text-gray-500">
          Isi detail keluhan atau permintaan bantuan Anda.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border-gray-100 shadow-sm">
        <TicketForm onSubmit={handleCreateSubmit} isLoading={isProcessing} />
      </div>
    </div>
  );
}
