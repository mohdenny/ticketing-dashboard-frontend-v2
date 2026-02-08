'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useTickets } from '@/hooks/useTickets';
import {
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Filter,
  Search,
  ChevronRight,
  RefreshCcw,
} from 'lucide-react';

// Definisikan tipe Tiket secara lokal jika belum ada agar TS lebih tenang
interface Ticket {
  id?: number | string;
  title: string;
  description: string;
  status: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TicketList({ query }: { query: string }) {
  const { tickets, isLoading, deleteTicket } = useTickets();
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortDate, setSortDate] = useState('desc');

  // PERBAIKAN TS: Tambahkan pengecekan null/undefined di dalam fungsi
  const checkIsUpdated = (created?: string, updated?: string) => {
    if (!created || !updated) return false;
    return new Date(updated).getTime() - new Date(created).getTime() > 1000;
  };

  const filteredTickets = useMemo(() => {
    const safeTickets = (tickets as Ticket[]) || [];
    let data = [...safeTickets];

    if (query) {
      const q = query.toLowerCase();
      data = data.filter(
        (t) =>
          t.title.toLowerCase().includes(q) || t.id?.toString().includes(q),
      );
    }

    if (filterStatus !== 'all') {
      data = data.filter((t) => t.status === filterStatus);
    }

    data.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDate === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [tickets, query, filterStatus, sortDate]);

  const handleDelete = async (id: string | number) => {
    if (!confirm('Yakin ingin menghapus tiket ini?')) return;
    const tid = toast.loading('Menghapus...');
    try {
      await deleteTicket(Number(id));
      toast.success('Dihapus', { id: tid });
    } catch (err: any) {
      toast.error(err.message || 'Gagal', { id: tid });
    }
  };

  if (isLoading) {
    return (
      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 w-full bg-gray-50 animate-pulse rounded-2xl border border-gray-100"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <p className="text-sm text-gray-500 font-medium">
          Ditemukan{' '}
          <span className="text-black font-bold">{filteredTickets.length}</span>{' '}
          tiket
        </p>

        <div className="flex gap-2">
          <div className="relative">
            <Filter
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold border-none bg-gray-100 pl-8 pr-4 py-2.5 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-black/5 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="open">Open</option>
              <option value="process">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <select
            value={sortDate}
            onChange={(e) => setSortDate(e.target.value)}
            className="text-xs font-semibold border-none bg-gray-100 px-4 py-2.5 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-black/5 cursor-pointer"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </div>
      </div>

      {/* RENDER LIST */}
      {filteredTickets.length > 0 ? (
        <ul className="space-y-4">
          {filteredTickets.map((t) => {
            // Memanggil fungsi dengan aman
            const hasUpdate = checkIsUpdated(t.createdAt, t.updatedAt);

            return (
              <li
                key={t.id}
                className="group border border-gray-100 p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 relative"
              >
                <div className="w-full sm:w-24 h-24 shrink-0 overflow-hidden rounded-xl border border-gray-50 bg-gray-50">
                  <img
                    src={t.image || 'https://placehold.co/400?text=No+Image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={t.title}
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-500">
                            #{t.id}
                          </span>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${
                              t.status === 'open'
                                ? 'bg-emerald-50 text-emerald-600'
                                : t.status === 'process'
                                  ? 'bg-amber-50 text-amber-600'
                                  : 'bg-gray-50 text-gray-500'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1 pr-12">
                          <Link href={`/tickets/${t.id}`}>{t.title}</Link>
                        </h3>
                      </div>

                      <div className="flex gap-1 z-10">
                        <Link
                          href={`/tickets/edit/${t.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(t.id!)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-1 mt-1 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-gray-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleDateString('id-ID')
                        : '-'}
                    </div>

                    {/* TANDA UPDATED */}
                    {hasUpdate && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md ring-1 ring-blue-100 animate-in fade-in duration-300">
                        <RefreshCcw size={10} className="animate-spin-slow" />
                        <span>Diperbarui</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                      <Clock size={12} />
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}{' '}
                      WIB
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-20 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl">
          <Search className="text-gray-300 mx-auto mb-4" size={32} />
          <h3 className="text-gray-900 font-bold text-lg">
            Tidak ada tiket ditemukan
          </h3>
        </div>
      )}
    </div>
  );
}
