'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTicketDetail, useTickets } from '@/hooks/useTickets';
import { toast } from 'sonner';
import Link from 'next/link';
import { CancelAction } from '@/components/layouts/CancelAction';
import {
  Edit3,
  Calendar,
  Clock,
  Hash,
  AlertCircle,
  Loader2,
  History,
  Trash2,
} from 'lucide-react';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  const { data: ticket, isLoading, error } = useTicketDetail(ticketId);
  const { deleteTicket } = useTickets();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasBeenUpdated = !!(
    ticket?.updatedAt &&
    ticket?.createdAt &&
    new Date(ticket.updatedAt).getTime() -
      new Date(ticket.createdAt).getTime() >
      1000
  );

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus tiket ini?')) return;

    setIsDeleting(true);
    const tid = toast.loading('Menghapus tiket...');
    try {
      await deleteTicket(ticketId);
      toast.success('Tiket berhasil dihapus', { id: tid });
      router.push('/tickets');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus tiket', { id: tid });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#6750A4] mb-2" size={32} />
        <p className="text-gray-500 font-medium">Memuat detail tiket...</p>
      </div>
    );

  if (error || !ticket)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900">
          Tiket Tidak Ditemukan
        </h2>

        <CancelAction link="/tickets" label="Kembali ke Daftar" />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto lg:max-w-full px-4 py-10">
      {/* Lightbox Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            alt="Zoom"
          />
        </div>
      )}

      <CancelAction link="/tickets" label="Kembali ke Daftar" />

      <div className="bg-white border border-gray-100 p-6 md:p-10 rounded-[32px] shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3 text-[10px] font-black uppercase tracking-wider">
              <span
                className={`px-3 py-1 rounded-full ${ticket.status === 'open' ? 'bg-emerald-100 text-emerald-700' : ticket.status === 'process' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}
              >
                {ticket.status}
              </span>

              {hasBeenUpdated && (
                <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-3 py-1 rounded-full ring-1 ring-blue-100">
                  <History size={10} /> Edited
                </span>
              )}

              <div className="flex items-center gap-1 text-gray-400 font-mono">
                <Hash size={12} /> {ticket.id}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              {ticket.title}
            </h1>
          </div>

          {/* Tombol Action */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-50 text-red-600 px-5 py-3 rounded-2xl text-sm font-bold hover:bg-red-100 transition-all active:scale-95 disabled:opacity-50 border border-red-100"
            >
              <Trash2 size={18} />
              <span className="md:hidden lg:inline">Hapus</span>
            </button>

            <Link
              href={`/tickets/edit/${ticket.id}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1C1B1F] text-white px-5 py-3 rounded-2xl text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              <Edit3 size={18} />
              <span>Edit Tiket</span>
            </Link>
          </div>
        </div>

        {/* Informasi Waktu & Status Update */}
        <div
          className={`grid grid-cols-1 ${hasBeenUpdated ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-4 mb-8 p-4 bg-[#F3EDF7]/50 rounded-2xl border border-[#E6E0E9]`}
        >
          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Calendar size={18} className="text-[#6750A4]" />
            </div>
            <div>
              <p className="text-gray-400 uppercase font-black text-[9px]">
                Dibuat
              </p>
              <p className="font-bold text-xs">
                {ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleDateString('id-ID')
                  : '-'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Clock size={18} className="text-[#6750A4]" />
            </div>
            <div>
              <p className="text-gray-400 uppercase font-black text-[9px]">
                Waktu
              </p>
              <p className="font-bold text-xs">
                {ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '-'}{' '}
                WIB
              </p>
            </div>
          </div>

          {hasBeenUpdated && (
            <>
              <div className="flex items-center gap-3 text-blue-700">
                <div className="p-2 bg-blue-100 rounded-xl shadow-sm">
                  <History size={18} />
                </div>
                <div>
                  <p className="text-blue-500 uppercase font-black text-[9px]">
                    Terakhir Diupdate
                  </p>
                  <p className="font-bold text-xs">
                    {ticket.updatedAt
                      ? new Date(ticket.updatedAt).toLocaleDateString('id-ID')
                      : '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-blue-700">
                <div className="p-2 bg-blue-100 rounded-xl shadow-sm">
                  <Clock size={18} className="text-[#6750A4]" />
                </div>
                <div>
                  <p className="text-blue-500 uppercase font-black text-[9px]">
                    Waktu
                  </p>
                  <p className="font-bold text-xs">
                    {ticket.updatedAt
                      ? new Date(ticket.updatedAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}{' '}
                    WIB
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mb-10">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
            Deskripsi Masalah
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
            {ticket.description}
          </p>
        </div>

        {ticket.image && (
          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              Lampiran Foto
            </h2>
            <div
              className="relative group cursor-zoom-in overflow-hidden rounded-[24px] border border-gray-100"
              onClick={() => setSelectedImage(ticket.image || null)}
            >
              <img
                src={ticket.image}
                className="w-72 h-auto shadow-sm transition-transform duration-500 group-hover:scale-[1.01]"
                alt="Attachment"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Klik untuk Perbesar
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
