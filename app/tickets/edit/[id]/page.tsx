'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTicketDetail, useTickets } from '@/hooks/useTickets';
import { TicketFormValues } from '@/schemas/ticketSchema';
import { useMemo } from 'react';

// Components
import TicketForm from '@/components/modules/tickets/TicketForm';
import Timeline, { TimelineEvent } from '@/components/ui/timeline';
import { CancelAction } from '@/components/layouts/CancelAction';
import { Loader2, History } from 'lucide-react';

export default function EditTicketPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  // 1. Ambil data detail
  const { data: ticket, isLoading, error } = useTicketDetail(ticketId);
  const { updateTicket, isProcessing } = useTickets();

  // 2. Transform Data: Gabungkan 'Created' + 'Updates' menjadi Timeline Events
  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (!ticket) return [];

    // A. Event Pertama: Pembuatan Tiket
    const createdEvent: TimelineEvent = {
      id: 'created',
      title: 'Tiket Dibuat',
      description: 'Tiket berhasil masuk ke sistem.',
      date: ticket.createdAt,
      user: 'System / User',
    };

    // B. Event Selanjutnya: Riwayat Updates
    const updateEvents: TimelineEvent[] = (ticket.updates || []).map(
      (u: any) => {
        // LOGIC SINKRONISASI: Handle images array & legacy image string
        let updateImages: string[] = [];
        if (u.images && Array.isArray(u.images)) {
          updateImages = u.images;
        } else if (u.image && typeof u.image === 'string') {
          updateImages = [u.image];
        }

        return {
          id: u.id,
          title: 'Update Progress',
          description: u.description,
          date: u.date || u.timestamp,
          user: u.user,
          images: updateImages,
        };
      },
    );

    // C. Gabung dan Sortir (Terlama di Atas -> Terbaru di Bawah)
    return [createdEvent, ...updateEvents].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [ticket]);

  // 3. Handle Submit
  // [FIXED]: Definisi tipe 'history' sekarang sudah menyertakan 'status'
  const handleUpdateSubmit = async (
    formData: TicketFormValues,
    history?: {
      description: string;
      user: string;
      images?: string[];
      status: 'open' | 'process' | 'closed'; // Sinkron dengan TicketForm
    },
  ) => {
    try {
      await updateTicket({
        id: ticketId,
        data: formData,
        history: history,
      });

      router.push('/tickets');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Gagal memperbarui tiket.');
    }
  };

  // --- RENDERING STATES ---

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-red-500 font-semibold bg-red-50 px-4 py-2 rounded-lg border border-red-100">
          Gagal memuat data: {error.message}
        </p>
        <CancelAction link="/tickets" label="Kembali ke Daftar" />
      </div>
    );

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="animate-spin text-[#6750A4]" size={40} />
        <p className="text-[#49454F] font-medium">Memuat data tiket...</p>
      </div>
    );

  if (!ticket)
    return (
      <div className="text-center py-20">
        <p>Data tiket tidak ditemukan.</p>
        <CancelAction link="/tickets" label="Kembali" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1B20] tracking-tight flex items-center gap-3">
            Edit Tiket
            <span className="bg-[#E8DEF8] text-[#1D192B] text-lg px-3 py-1 rounded-full font-mono">
              #{ticket.id}
            </span>
          </h1>
          <p className="text-sm text-[#49454F] mt-2">
            Perbarui informasi tiket dan pantau kronologi pengerjaan.
          </p>
        </div>
        <div className="flex-shrink-0">
          <CancelAction link="/tickets" label="Batal & Kembali" />
        </div>
      </div>

      {/* GRID LAYOUT: KIRI (FORM) - KANAN (TIMELINE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* KOLOM KIRI: FORM EDIT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] p-6 border border-[#CAC4D0] shadow-sm">
            <TicketForm
              initialData={ticket}
              onSubmit={handleUpdateSubmit}
              isLoading={isProcessing}
            />
          </div>
        </div>

        {/* KOLOM KANAN: TIMELINE / TRACKING */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[24px] p-6 border border-[#CAC4D0] shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-6 border-b border-[#E6E0E9] pb-4">
              <History className="text-[#6750A4]" size={20} />
              <h2 className="text-lg font-bold text-[#1D1B20]">
                Riwayat Pengerjaan
              </h2>
            </div>

            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <Timeline
                events={timelineEvents}
                status={ticket.status}
                emptyMessage="Belum ada update terbaru."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
