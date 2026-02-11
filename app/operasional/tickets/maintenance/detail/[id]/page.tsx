'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/layouts/PageTitle';
import { useMaintenanceDetail } from '@/hooks/useMaintenance';
import {
  Loader2,
  Calendar,
  MapPin,
  User,
  ClipboardList,
  Activity,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  History,
  ArrowLeft,
} from 'lucide-react';

export default function MaintenanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  // Fetch Data
  const { data: ticket, isLoading } = useMaintenanceDetail(id);
  console.log(data);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('open') || s.includes('schedule'))
      return 'bg-[#D3E3FD] text-[#041E49] border-[#041E49]/10';
    if (s.includes('process'))
      return 'bg-[#FFEB3B]/30 text-[#625B00] border-[#625B00]/10';
    if (s.includes('close') || s.includes('done'))
      return 'bg-[#C4EED0] text-[#0A3818] border-[#0A3818]/10';
    return 'bg-[#E6E0E9] text-[#49454F] border-[#49454F]/10';
  };

  // Render loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFF] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6750A4]" size={40} />
      </div>
    );
  }

  // Empty state
  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#FDFCFF] flex flex-col items-center justify-center gap-4">
        <p className="text-[#49454F] font-medium">
          Tiket maintenance tidak ditemukan.
        </p>
        <button
          onClick={() => router.back()}
          className="text-[#6750A4] font-bold hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
      </div>
    );
  }

  // Render content
  return (
    <div className="min-h-screen bg-[#FDFCFF] p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Navigation */}
        <PageTitle
          title={`Detail Maintenance #${ticket.id}`}
          description="Informasi lengkap jadwal dan riwayat pengerjaan."
          actionButton={{
            label: 'Edit / Update',
            link: `/operasional/tickets/maintenance/edit/${id}`,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KOLOM KIRI: INFO UTAMA */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card: Status & Title */}
            <div className="bg-[#FEF7FF] rounded-[24px] p-6 border border-[#CAC4D0] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#6750A4]"></div>

              <div className="flex justify-between items-start mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(ticket.status)}`}
                >
                  {ticket.status}
                </span>
                <span className="text-xs text-[#79747E] font-medium bg-[#F3EDF7] px-2 py-1 rounded-lg">
                  Dibuat: {formatDate(ticket.createdAt)}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-[#1D1B20] mb-2">
                {ticket.title}
              </h2>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-[#49454F]">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#6750A4]" />
                  <span className="font-semibold">{ticket.siteId || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-[#6750A4]" />
                  <span>
                    {ticket.pic || ticket.reporters?.[0] || 'Unassigned'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardList size={18} className="text-[#6750A4]" />
                  <span>{ticket.category}</span>
                </div>
              </div>
            </div>

            {/* Card: Detail Teknis */}
            <div className="bg-[#FEF7FF] rounded-[24px] p-6 border border-[#CAC4D0] shadow-sm">
              <h3 className="text-lg font-bold text-[#1D1B20] mb-4 flex items-center gap-2">
                <Activity size={20} className="text-[#6750A4]" /> Detail Teknis
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <label className="text-[#79747E] text-xs block mb-1">
                    Trouble Source
                  </label>
                  <p className="font-medium text-[#1D1B20] flex items-center gap-2">
                    <AlertTriangle size={14} className="text-[#B3261E]" />
                    {ticket.troubleSource}
                  </p>
                </div>
                <div>
                  <label className="text-[#79747E] text-xs block mb-1">
                    Jadwal Pengerjaan
                  </label>
                  <p className="font-medium text-[#1D1B20] flex items-center gap-2">
                    <Calendar size={14} className="text-[#6750A4]" />
                    {formatDate(ticket.startTime)}
                  </p>
                </div>

                <div className="border-t border-[#E7E0EC] col-span-1 md:col-span-2 my-2"></div>

                <div>
                  <label className="text-[#79747E] text-xs block mb-1">
                    Network Element
                  </label>
                  <p className="font-medium text-[#1D1B20]">
                    {ticket.networkElement || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-[#79747E] text-xs block mb-1">
                    Status TX
                  </label>
                  <p className="font-medium text-[#1D1B20]">
                    {ticket.statusTx || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-[#79747E] text-xs block mb-1">
                    Impact TX
                  </label>
                  <p className="font-medium text-[#1D1B20]">
                    {ticket.impactTx || '-'}
                  </p>
                </div>
                <div>
                  <label className="text-[#79747E] text-xs block mb-1">
                    Estimasi Downtime
                  </label>
                  <p className="font-medium text-[#1D1B20]">
                    {ticket.estimasiDowntime || '-'}
                  </p>
                </div>
              </div>

              {/* Deskripsi & Broadcast */}
              <div className="mt-6 space-y-4">
                <div className="bg-[#F3EDF7]/50 p-4 rounded-xl border border-[#E7E0EC]">
                  <label className="text-[#6750A4] text-xs font-bold block mb-1">
                    Deskripsi Awal
                  </label>
                  <p className="text-sm text-[#49454F] leading-relaxed">
                    {ticket.description || 'Tidak ada deskripsi.'}
                  </p>
                </div>
                {ticket.broadcastExplanation && (
                  <div className="bg-[#FFF8F6] p-4 rounded-xl border border-[#FFDAD6]">
                    <label className="text-[#B3261E] text-xs font-bold block mb-1">
                      Broadcast Explanation
                    </label>
                    <p className="text-sm text-[#49454F] leading-relaxed">
                      {ticket.broadcastExplanation}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Card: Dokumentasi / Images */}
            {ticket.images && ticket.images.length > 0 && (
              <div className="bg-[#FEF7FF] rounded-[24px] p-6 border border-[#CAC4D0] shadow-sm">
                <h3 className="text-lg font-bold text-[#1D1B20] mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-[#6750A4]" /> Dokumentasi
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ticket.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl overflow-hidden border border-[#CAC4D0] bg-gray-100 relative group"
                    >
                      <img
                        src={img}
                        alt={`Bukti ${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kolom kanan timeline */}
          <div className="lg:col-span-1">
            <div className="bg-[#F3EDF7] rounded-[24px] p-6 border border-[#E7E0EC] h-full">
              <div className="flex items-center gap-2 mb-6 text-[#6750A4]">
                <History size={24} />
                <h3 className="text-lg font-bold">Riwayat Aktivitas</h3>
              </div>

              {!ticket.updates || ticket.updates.length === 0 ? (
                <p className="text-sm text-[#79747E] text-center italic mt-10">
                  Belum ada aktivitas.
                </p>
              ) : (
                <div className="relative border-l-2 border-[#CAC4D0] ml-3.5 space-y-8 pb-4">
                  {ticket.updates.map((log: any, idx: number) => (
                    <div key={idx} className="relative pl-8 group">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#6750A4] ring-4 ring-[#F3EDF7]"></div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-[#49454F] font-semibold bg-white px-2 py-0.5 rounded-full w-fit border border-[#CAC4D0]">
                          {formatDate(log.date)}
                        </span>

                        <div className="flex justify-between items-center mt-1">
                          <span className="font-bold text-[#1D1B20] text-sm">
                            {log.user || 'System'}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getStatusColor(log.status)}`}
                          >
                            {log.status}
                          </span>
                        </div>

                        {log.description && (
                          <div className="bg-white p-3 rounded-xl border border-[#CAC4D0] text-xs text-[#49454F] mt-1 shadow-sm leading-relaxed">
                            {log.description}
                          </div>
                        )}

                        {log.images && log.images.length > 0 && (
                          <div className="flex gap-1 mt-1 overflow-x-auto pb-1">
                            {log.images.map((img: string, i: number) => (
                              <div
                                key={i}
                                className="h-10 w-10 rounded-lg overflow-hidden border border-[#CAC4D0] bg-white shrink-0"
                              >
                                <img
                                  src={img}
                                  alt="log"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
