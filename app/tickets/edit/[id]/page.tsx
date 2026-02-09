'use client';

import TicketForm from '@/components/TicketForm';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useTicketDetail, useTickets } from '@/hooks/useTickets';
import { TicketFormValues } from '@/schemas/ticketSchema';

export default function EditTicketPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  // Ambil data detail untuk isi form
  const { data: ticket, isLoading, error } = useTicketDetail(ticketId);

  const { updateTicket, isProcessing } = useTickets();

  const handleUpdateSubmit = async (formData: TicketFormValues) => {
    try {
      await updateTicket({ id: ticketId, data: formData });
      // Kembali ke list setelah sukses
      router.push('/tickets');
      router.refresh();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Gagal memperbarui tiket.');
    }
  };

  if (error)
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-semibold">
          Gagal memuat data: {error.message}
        </p>
        <Link
          href="/tickets"
          className="text-blue-500 hover:underline mt-4 block"
        >
          Kembali ke Daftar
        </Link>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="ml-3 text-gray-500">Memuat data tiket...</p>
      </div>
    );

  if (!ticket)
    return <p className="text-center py-20">Data tiket tidak ditemukan.</p>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Link
        href="/tickets"
        className="text-sm text-gray-500 hover:text-black transition-colors mb-6 inline-flex items-center gap-1"
      >
        <span>←</span> Batal dan Kembali
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Edit Tiket{' '}
          <span className="text-gray-400 font-mono text-2xl">#{ticket.id}</span>
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Gunakan form di bawah untuk memperbarui status atau informasi tiket.
        </p>
      </div>

      <div className="bg-white p-1 rounded-2xl">
        <TicketForm
          initialData={ticket}
          onSubmit={handleUpdateSubmit}
          isLoading={isProcessing}
        />
      </div>
    </div>
  );
}
