'use client';

import { useRouter } from 'next/navigation';
import { useTrouble } from '@/hooks/tickets/useTrouble'; // Pastikan path hook sesuai
import { TroubleFormValues } from '@/schemas/tickets/trouble';
import TicketTroubleForm from '@/components/modules/tickets/trouble/TroubleForm';
import { CancelAction } from '@/components/layouts/CancelAction';

export default function CreateTicketPage() {
  const router = useRouter();

  // Mengambil createTicket dan isProcessing dari hook yang sudah kita perbaiki
  const { createTicket, isProcessing } = useTrouble();

  const handleCreateSubmit = async (data: TroubleFormValues) => {
    try {
      // Data langsung dikirim karena Schema Zod frontend == Schema Backend
      await createTicket(data);

      // Refresh router untuk memastikan data terbaru terambil jika menggunakan server component di list
      router.refresh();
      router.push('/operational/tickets/trouble');
    } catch (error: any) {
      console.error('Gagal membuat tiket:', error);
      // Opsi: Tampilkan toast/alert pesan error dari API (err.message)
      alert(error?.message || 'Gagal membuat tiket, silakan coba lagi.');
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
            link="/operational/tickets/trouble"
            label="Batal & Kembali"
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border-gray-100 shadow-sm">
        {/* Form ini harus menerima props yang sesuai dengan React Hook Form
           Pastikan TicketTroubleForm menggunakan useForm<TroubleFormValues>
        */}
        <TicketTroubleForm
          onSubmit={handleCreateSubmit}
          isLoading={isProcessing}
          // Mode create: tidak perlu passing defaultValues (atau pass undefined)
        />
      </div>
    </div>
  );
}
