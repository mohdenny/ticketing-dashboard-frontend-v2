'use client';

import { useTickets } from '@/hooks/useTickets';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  Inbox,
  Loader2,
  ImageIcon,
  ChevronRight,
} from 'lucide-react';

export default function TicketsPage() {
  const { tickets, isLoading, deleteTicket, isProcessing } = useTickets();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-[#FFDAD6] text-[#410002]';
      case 'process':
        return 'bg-[#EADDFF] text-[#21005D]';
      case 'closed':
        return 'bg-[#D3E4FF] text-[#001D36]';
      default:
        return 'bg-[#F3EDF7] text-[#1C1B1F]';
    }
  };

  // PERBAIKAN 1: Terima string atau number, lalu konversi ke yang dibutuhkan hook
  const handleDelete = async (id: string | number) => {
    if (confirm('Apakah Anda yakin ingin menghapus tiket ini?')) {
      try {
        // Jika hook kamu minta string: await deleteTicket(id.toString());
        // Jika hook kamu minta number: await deleteTicket(Number(id));
        // Kita gunakan casting 'any' atau sesuaikan dengan definisi hook useTickets Anda:
        await deleteTicket(id as any);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen bg-[#FEF7FF]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-[32px] font-medium text-[#1C1B1F] tracking-tight">
            Manajemen Tiket
          </h1>
          <p className="text-[#49454F] mt-1 text-base">
            Lacak dan kelola permintaan dukungan Anda.
          </p>
        </div>
        <Link
          href="/tickets/create"
          className="flex items-center justify-center gap-3 bg-[#6750A4] text-white px-6 py-4 rounded-[16px] font-medium shadow-md hover:shadow-lg active:scale-95 transition-all"
        >
          <Plus size={20} /> Buat Tiket
        </Link>
      </div>

      <div className="bg-[#F7F2FA] rounded-[28px] p-2 border border-[#E6E0E9]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#6750A4] mb-4" size={40} />
            <p className="text-[#49454F] font-medium">Menyinkronkan data...</p>
          </div>
        ) : tickets && tickets.length > 0 ? (
          <div className="space-y-1">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="group flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-[24px] hover:bg-[#F3EDF7] transition-all border border-transparent hover:border-[#E6E0E9]"
              >
                {/* Avatar Section */}
                <div className="relative shrink-0">
                  {ticket.image ? (
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#EADDFF]">
                      <img
                        src={ticket.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#6750A4] flex items-center justify-center text-white text-xl font-bold">
                      {ticket.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${getStatusStyle(ticket.status)}`}
                    >
                      {ticket.status}
                    </span>
                    <span className="text-[11px] font-mono text-[#938F99]">
                      #{ticket.id}
                    </span>
                  </div>
                  <Link href={`/tickets/${ticket.id}`}>
                    <h3 className="text-lg font-bold text-[#1C1B1F] group-hover:text-[#6750A4] transition-colors truncate">
                      {ticket.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-[#49454F] line-clamp-1">
                    {ticket.description}
                  </p>
                </div>

                {/* Metadata & Actions */}
                <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                  <span className="text-xs font-medium text-[#938F99]">
                    {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/tickets/edit/${ticket.id}`} // Tanpa tanda tanya (?)
                      className="p-2.5 text-[#49454F] hover:bg-[#EADDFF] rounded-full transition-all"
                    >
                      <Edit2 size={18} />
                    </Link>

                    {/* PERBAIKAN 2: Pastikan ticket.id tidak undefined sebelum dikirim */}
                    <button
                      onClick={() => ticket.id && handleDelete(ticket.id)}
                      disabled={isProcessing}
                      className="p-2.5 text-[#49454F] hover:bg-[#FFDAD6] hover:text-[#B3261E] rounded-full transition-all disabled:opacity-30"
                    >
                      <Trash2 size={18} />
                    </button>

                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="p-2.5 text-[#6750A4] hover:bg-[#EADDFF] rounded-full"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-6 bg-[#F3EDF7] rounded-full text-[#6750A4]">
                <Inbox size={64} strokeWidth={1} />
              </div>
              <h3 className="text-xl font-bold text-[#1C1B1F]">
                Hening di sini...
              </h3>
              <Link
                href="/tickets/create"
                className="mt-2 bg-[#6750A4] text-white px-8 py-3 rounded-full font-medium"
              >
                Buat Tiket Sekarang
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
