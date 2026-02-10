'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTicketDetail, useTickets } from '@/hooks/useTickets';
import { toast } from 'sonner';
import Link from 'next/link';

import { CancelAction } from '@/components/layouts/CancelAction';
import {
  Edit3,
  Hash,
  AlertCircle,
  Loader2,
  Trash2,
  History,
  ImageIcon,
  User,
  Clock,
  CheckCircle2,
  FileText,
  CalendarDays,
  MoreHorizontal,
  Info,
} from 'lucide-react';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const { data: ticket, isLoading, error } = useTicketDetail(ticketId);
  const { deleteTicket } = useTickets();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const activities = useMemo(() => {
    if (!ticket) return [];

    const items = [
      {
        id: 'created',
        ticketId: ticket.id, // Sinkronisasi Type
        type: 'initial',
        title: 'Tiket Dibuat',
        content: 'Tiket berhasil dibuat dan masuk ke sistem.',
        date: ticket.createdAt,
        user: 'System',
        images: [] as string[],
        status: 'open' as const,
      },
      ...(ticket.updates || []).map((u: any) => {
        let updateImages: string[] = [];
        if (u.images && Array.isArray(u.images)) {
          updateImages = u.images;
        } else if (u.image && typeof u.image === 'string') {
          updateImages = [u.image];
        }

        return {
          id: u.id,
          ticketId: u.ticketId || ticket.id, // Fallback jika data lama belum punya ticketId
          type: 'update',
          title: 'Update Progress',
          content: u.description,
          date: u.date || u.timestamp,
          user: u.user,
          images: updateImages,
          status: u.status,
        };
      }),
    ];

    return items.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [ticket]);

  const handleDelete = async () => {
    if (!confirm('Hapus tiket ini permanen?')) return;
    setIsDeleting(true);
    const tid = toast.loading('Menghapus...');
    try {
      await deleteTicket(ticketId);
      toast.success('Terhapus', { id: tid });
      router.push('/tickets');
    } catch (err: any) {
      toast.error('Gagal hapus', { id: tid });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#6750A4] mb-2" size={32} />
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );

  if (error || !ticket)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Tiket Tidak Ditemukan
        </h2>
        <CancelAction link="/tickets" label="Kembali" />
      </div>
    );

  const legacyImage = (ticket as any).image;
  const mainImages =
    ticket.images && ticket.images.length > 0
      ? ticket.images
      : legacyImage
        ? [legacyImage]
        : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
            alt="Zoom"
          />
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
            <CancelAction link="/tickets" label="Daftar Tiket" />
            <span>/</span>
            <span>Detail</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1D1B20] tracking-tight">
              {ticket.title}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${ticket.status === 'open' ? 'bg-blue-50 text-blue-700 border-blue-100' : ticket.status === 'process' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
            >
              {ticket.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Link
            href={`/tickets/edit/${ticket.id}`}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F3EDF7] text-[#1D1B20] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#E8DEF8] transition-colors"
          >
            <Edit3 size={16} />
            <span>Update Progress</span>
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 border border-transparent hover:border-red-100"
            title="Hapus Tiket"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* KOLOM KIRI (KONTEN UTAMA) */}
        <div className="lg:col-span-8 space-y-10">
          <div className="relative pl-4 md:pl-0">
            <div className="flex items-center gap-2 mb-3 text-[#6750A4]">
              <FileText size={20} />
              <h3 className="font-bold text-lg">Detail Masalah</h3>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-[#1D1B20] leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                {ticket.description}
              </p>

              {mainImages.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ImageIcon size={14} /> Lampiran Awal ({mainImages.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mainImages.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative aspect-video cursor-zoom-in overflow-hidden rounded-xl border border-gray-100 bg-gray-50 group"
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          alt={`Lampiran ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#FEF7FF] px-4 text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <History size={14} /> Kronologi Pengerjaan
              </span>
            </div>
          </div>

          <div className="space-y-0 pl-2 md:pl-0">
            {activities.map((activity, index) => {
              const isLast = index === activities.length - 1;
              const isInitial = activity.type === 'initial';
              const isClosed = ticket.status === 'closed';
              const isFinalEvent = isLast && isClosed;

              return (
                <div
                  key={activity.id}
                  className="relative flex gap-4 sm:gap-6 group"
                >
                  {!isLast && (
                    <div className="absolute left-[19px] sm:left-[23px] top-10 bottom-[-20px] w-[2px] bg-gray-200 group-hover:bg-gray-300 transition-colors" />
                  )}

                  <div className="flex-shrink-0 z-10 pt-1">
                    <div
                      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-[#FEF7FF] shadow-sm transition-transform group-hover:scale-110 ${
                        isFinalEvent
                          ? 'bg-green-100 text-green-700'
                          : isInitial
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-[#EADDFF] text-[#21005D]'
                      }`}
                    >
                      {isFinalEvent ? (
                        <CheckCircle2 size={20} />
                      ) : isInitial ? (
                        <MoreHorizontal size={20} />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 pb-10">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-bold text-sm text-gray-900">
                        {isFinalEvent
                          ? 'Tiket Selesai'
                          : isInitial
                            ? 'System Log'
                            : activity.user}
                      </span>
                      <span className="text-gray-300 text-xs">•</span>
                      <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md">
                        {formatDate(activity.date)}
                      </span>
                    </div>

                    <div
                      className={`p-5 rounded-2xl text-sm leading-relaxed border shadow-sm relative ${
                        isFinalEvent
                          ? 'bg-green-50 border-green-100 text-green-900'
                          : isInitial
                            ? 'bg-gray-50/50 border-gray-100 text-gray-500 italic'
                            : 'bg-white border-gray-200 text-gray-700'
                      }`}
                    >
                      <div
                        className={`absolute top-4 -left-[7px] w-3 h-3 border-l border-t rotate-[-45deg] bg-inherit border-inherit ${
                          isFinalEvent
                            ? 'bg-green-50 border-green-100'
                            : isInitial
                              ? 'bg-gray-50 border-gray-100'
                              : 'bg-white border-gray-200'
                        }`}
                      ></div>

                      <p>{activity.content}</p>

                      {activity.images && activity.images.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-black/5">
                          <p className="text-[10px] font-bold opacity-60 uppercase mb-2 flex items-center gap-1">
                            <ImageIcon size={10} /> Bukti Pengerjaan:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {activity.images.map((img: string, i: number) => (
                              <div
                                key={i}
                                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-black/10 cursor-zoom-in hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImage(img)}
                              >
                                <img
                                  src={img}
                                  className="w-full h-full object-cover"
                                  alt="Update"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KOLOM KANAN (SIDEBAR INFO) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          <div className="bg-white border border-[#CAC4D0] rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <div className="p-2 bg-[#F3EDF7] rounded-lg text-[#6750A4]">
                <Info size={20} />
              </div>
              <h3 className="font-bold text-[#1D1B20]">Informasi Tiket</h3>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-start group">
                <div className="flex items-center gap-3 w-full">
                  <div className="mt-0.5 text-gray-400 group-hover:text-[#6750A4] transition-colors">
                    <Hash size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">
                      Ticket ID
                    </p>
                    <p className="text-lg font-mono font-bold text-gray-800 tracking-wide">
                      {ticket.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start group">
                <div className="flex items-center gap-3">
                  <div className="mt-0.5 text-gray-400 group-hover:text-[#6750A4] transition-colors">
                    <CalendarDays size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Tanggal Dibuat
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start group">
                <div className="flex items-center gap-3">
                  <div className="mt-0.5 text-gray-400 group-hover:text-[#6750A4] transition-colors">
                    <History size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Update Terakhir
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {ticket.updatedAt ? formatDate(ticket.updatedAt) : '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start group">
                <div className="flex items-center gap-3">
                  <div className="mt-0.5 text-gray-400 group-hover:text-[#6750A4] transition-colors">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Total Aktivitas
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {activities.length} Events
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`mt-6 p-4 rounded-xl flex items-center justify-between ${
                ticket.status === 'open'
                  ? 'bg-blue-50 text-blue-900'
                  : ticket.status === 'process'
                    ? 'bg-yellow-50 text-yellow-900'
                    : 'bg-green-50 text-green-900'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                Status
              </span>
              <span className="font-black text-sm uppercase">
                {ticket.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
