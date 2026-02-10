'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useTickets } from '@/hooks/useTickets';
import {
  Edit3,
  Trash2,
  Calendar,
  History,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Eye,
} from 'lucide-react';
// Pastikan import ConfirmDialog sesuai lokasi file kamu
import ConfirmDialog from '@/components/layouts/ConfirmDialog';

interface Ticket {
  id?: number | string;
  title: string;
  description: string;
  status: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function TicketList({ query }: { query: string }) {
  const { tickets, isLoading, deleteTicket } = useTickets();
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortDate, setSortDate] = useState('desc');

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // State untuk Confirm Dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const checkIsUpdated = (created?: string, updated?: string) => {
    if (!created || !updated) return false;
    return new Date(updated).getTime() - new Date(created).getTime() > 1000;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Logic filter
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

  // Logic Pagination
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTickets, currentPage]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  // Handler Trigger Modal
  const onTrashClick = (id: string | number) => {
    setSelectedId(id.toString());
    setIsModalOpen(true);
  };

  // Handler Eksekusi Hapus
  const handleDelete = async () => {
    if (!selectedId) return;

    // Tutup modal dulu atau biarkan loading state (tergantung preferensi UI/UX)
    setIsModalOpen(false);

    const tid = toast.loading('Menghapus...');
    try {
      await deleteTicket(selectedId);
      toast.success('Tiket berhasil dihapus', { id: tid });
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus', { id: tid });
    } finally {
      setSelectedId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-[#D3E3FD] text-[#041E49] border-[#041E49]/10';
      case 'process':
        return 'bg-[#FFEB3B]/30 text-[#625B00] border-[#625B00]/10';
      case 'closed':
        return 'bg-[#E1E2E1] text-[#1C1B1F] border-[#1C1B1F]/10';
      default:
        return 'bg-[#E6E0E9] text-[#49454F] border-[#49454F]/10';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#FEF7FF] rounded-[24px] p-6 space-y-4 border border-[#CAC4D0]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-12 w-full bg-[#F3EDF7] animate-pulse rounded-full"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* --- FILTER & CONTROLS --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FEF7FF] p-4 rounded-[24px] border border-[#CAC4D0]/50 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-[#49454F]">
          <span className="bg-[#E8DEF8] text-[#1D192B] font-bold px-3 py-1 rounded-full text-xs">
            Total: {filteredTickets.length}
          </span>
          <span className="hidden sm:inline">Data ditemukan</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <ArrowUpDown size={14} className="text-[#6750A4]" />
            </div>
            <select
              value={sortDate}
              onChange={(e) => setSortDate(e.target.value)}
              className="appearance-none bg-[#F3EDF7] hover:bg-[#E8DEF8] transition-colors pl-9 pr-8 py-2.5 rounded-xl text-sm font-medium text-[#1D1B20] outline-none focus:ring-2 focus:ring-[#6750A4] cursor-pointer border-none min-w-[140px]"
            >
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Filter size={14} className="text-[#6750A4]" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-[#F3EDF7] hover:bg-[#E8DEF8] transition-colors pl-9 pr-8 py-2.5 rounded-xl text-sm font-medium text-[#1D1B20] outline-none focus:ring-2 focus:ring-[#6750A4] cursor-pointer border-none min-w-[160px]"
            >
              <option value="all">Semua Status</option>
              <option value="open">Open</option>
              <option value="process">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-[#FEF7FF] border border-[#CAC4D0] rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#49454F] uppercase bg-[#F3EDF7] border-b border-[#E6E0E9]">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">
                  Tiket Info
                </th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider">Waktu</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E0E9]">
              {paginatedTickets.length > 0 ? (
                paginatedTickets.map((t) => {
                  const hasUpdate = checkIsUpdated(t.createdAt, t.updatedAt);
                  return (
                    <tr
                      key={t.id}
                      className="group bg-[#FEF7FF] hover:bg-[#F3EDF7] transition-colors duration-200"
                    >
                      {/* Column 1: Image & Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-[12px] bg-[#E6E0E9] overflow-hidden border border-[#CAC4D0] shrink-0">
                            <img
                              src={t.image || 'https://placehold.co/100?text=?'}
                              alt="thumb"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="max-w-[200px] sm:max-w-xs">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] bg-[#E8DEF8] text-[#1D192B] px-1.5 py-0.5 rounded font-bold">
                                #{t.id}
                              </span>
                            </div>
                            <Link
                              href={`/tickets/${t.id}`}
                              className="font-semibold text-[#1C1B1F] text-base hover:text-[#6750A4] transition-colors line-clamp-1"
                            >
                              {t.title}
                            </Link>
                            <p className="text-[#49454F] text-xs line-clamp-1 mt-0.5">
                              {t.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(
                            t.status,
                          )}`}
                        >
                          {t.status}
                        </span>
                      </td>

                      {/* Column 3: Timestamps */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[#49454F]">
                            <Calendar size={14} className="text-[#6750A4]" />
                            <span className="font-medium text-xs">
                              {formatDate(t.createdAt)}
                            </span>
                          </div>

                          {hasUpdate && t.updatedAt && (
                            <div className="flex items-center gap-2 text-[#006391] bg-[#C2E7FF]/30 px-2 py-1 rounded-lg w-fit">
                              <History size={12} />
                              <span className="text-[10px] font-bold">
                                Diedit: {formatDate(t.updatedAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Column 4: Actions (Fixed Visibility & Colored) */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link
                            href={`/tickets/${t.id}`}
                            className="p-2 text-[#49454F] bg-[#F2F2F2] hover:bg-[#E0E0E0] rounded-full transition-all border border-[#CAC4D0]/30"
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/tickets/edit/${t.id}`}
                            className="p-2 text-[#6750A4] bg-[#F3EDF7] hover:bg-[#E8DEF8] rounded-full transition-all border border-[#E8DEF8]"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </Link>
                          <button
                            onClick={() => onTrashClick(t.id!)}
                            className="p-2 text-[#B3261E] bg-[#FFF8F6] hover:bg-[#FFDAD6] rounded-full transition-all border border-[#FFDAD6]"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-[#49454F]">
                      <div className="bg-[#F3EDF7] p-4 rounded-full mb-3">
                        <Search size={24} className="text-[#CAC4D0]" />
                      </div>
                      <p className="font-medium">Tidak ada tiket ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        {filteredTickets.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-[#F3EDF7] border-t border-[#E6E0E9]">
            <div className="text-xs text-[#49454F] font-medium">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl hover:bg-[#E8DEF8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#49454F]"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl hover:bg-[#E8DEF8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#49454F]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isModalOpen}
        title="Hapus Tiket?"
        message="Data ini akan dihapus permanen dari sistem."
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        isDestructive
      />
    </div>
  );
}
