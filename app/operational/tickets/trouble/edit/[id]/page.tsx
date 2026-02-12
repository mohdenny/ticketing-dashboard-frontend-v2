'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTroubleDetail, useTrouble } from '@/hooks/tickets/useTrouble'; // Pastikan path hook benar
import { TroubleFormValues } from '@/schemas/tickets/trouble';
import { Trouble, TroubleHistory } from '@/types/tickets/trouble'; // Import tipe baru
import { useMemo } from 'react';
import TicketTroubleForm from '@/components/modules/tickets/trouble/TroubleForm';
import Timeline, { TimelineEvent } from '@/components/ui/timeline'; // Pastikan path komponen UI benar
import { CancelAction } from '@/components/layouts/CancelAction';
import { Loader2, History } from 'lucide-react';

export default function EditTicketPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  // Ambil data detail dengan tipe yang aman
  const { data: ticketData, isLoading, error } = useTroubleDetail(ticketId);
  const ticket = ticketData as Trouble | undefined;

  const { updateTicket, isProcessing } = useTrouble();

  // Transform Data: Gabungkan 'Created' + 'Updates' menjadi Timeline Events
  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (!ticket) return [];

    // Event Pertama: Pembuatan Tiket
    const createdEvent: TimelineEvent = {
      id: 'created',
      title: 'Tiket Dibuat',
      description: 'Tiket berhasil masuk ke sistem.',
      date: ticket.createdAt,
      // Fallback jika reporters kosong
      user: ticket.reporters?.join(', ') || 'System',
    };

    // Event Selanjutnya: Riwayat Updates
    // Mapping menggunakan tipe TroubleHistory
    const updateEvents: TimelineEvent[] = (ticket.updates || []).map(
      (u: TroubleHistory) => {
        return {
          id: u.id,
          title: 'Update Progress',
          description: u.description,
          date: u.date,
          // Join array reporters menjadi string untuk UI Timeline
          user: u.reporters ? u.reporters.join(', ') : 'Unknown',
          images: u.images || [],
        };
      },
    );

    // Gabung dan Sortir (Terlama di Atas -> Terbaru di Bawah)
    return [createdEvent, ...updateEvents].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [ticket]);

  // Handle Submit
  // Sinkronisasi: Hanya menerima satu argumen 'data' karena Schema Zod sudah menyatukan main data & history context
  const handleUpdateSubmit = async (formData: TroubleFormValues) => {
    try {
      await updateTicket({
        id: ticketId,
        data: formData, // Data form sudah mencakup updateDescription, updateReporters, dll.
      });

      router.refresh(); // Refresh server component data
      router.push('/operational/tickets/trouble');
    } catch (err: any) {
      console.error('Update failed:', err);
      // Tampilkan alert error yang lebih informatif jika ada message dari API
      alert(err?.message || 'Gagal memperbarui tiket.');
    }
  };

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-red-500 font-semibold bg-red-50 px-4 py-2 rounded-lg border border-red-100">
          Gagal memuat data: {error.message}
        </p>
        <CancelAction
          link="/operational/tickets/trouble"
          label="Kembali ke Daftar"
        />
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
        <CancelAction link="/operational/tickets/trouble" label="Kembali" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1B20] tracking-tight flex items-center gap-3">
            Edit Tiket{' '}
            <span className="bg-[#E8DEF8] text-[#1D192B] text-lg px-3 py-1 rounded-full font-mono">
              #{ticket.id}
            </span>
          </h1>
          <p className="text-sm text-[#49454F] mt-2">
            Perbarui informasi tiket dan pantau kronologi pengerjaan.
          </p>
        </div>
        <div className="flex-shrink-0">
          <CancelAction
            link="/operational/tickets/trouble"
            label="Batal & Kembali"
          />
        </div>
      </div>

      {/* Grid layout: kiri form, kanan timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* kolom kiri form edit */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] p-6 border border-[#CAC4D0] shadow-sm">
            {/* Pass initialData dari ticket.
                Pastikan TicketTroubleForm menangani mapping data:
                - ticket.updates -> tidak perlu dimasukkan ke form (form handling update baru)
                - ticket.status -> form status
            */}
            <TicketTroubleForm
              // Casting ke any jika struktur ticket di DB sedikit berbeda dengan form values,
              // Tapi idealnya Form Component melakukan mapping defaultValues di dalam.
              initialData={ticket as any}
              onSubmit={handleUpdateSubmit}
              isLoading={isProcessing}
              isEditMode={true} // Opsional: Flag untuk memberitahu form ini mode edit
            />
          </div>
        </div>

        {/* Kolom kanan, timeline / tracking */}
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
