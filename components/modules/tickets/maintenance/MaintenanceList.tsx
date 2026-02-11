'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useMaintenance } from '@/hooks/useMaintenance';
import {
  Edit3,
  Trash2,
  Calendar,
  Search,
  Zap,
  Activity,
  Eye,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  MapPin,
} from 'lucide-react';
import ConfirmDialog from '@/components/layouts/ConfirmDialog';

// Asumsi tipe data (sesuaikan jika ada properti yang berbeda di interface asli)
interface MaintenanceTicket {
  id: string;
  title: string;
  siteId?: string;
  startTime: string; // atau scheduleDate
  status: string;
  troubleSource?: string; // atau category
  networkElement?: string;
  statusTx?: string;
  createdAt: string;
}

export default function MaintenanceList({ query }: { query: string }) {
  const { maintenanceTickets, isLoading, deleteMaintenance } = useMaintenance();

  // --- STATE MANAGEMENT (Disamakan dengan TicketTroubleList) ---
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortDate, setSortDate] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // --- HELPER COLORS (M3 Palette) ---
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('open') || s.includes('schedule')) {
      return 'bg-[#D3E3FD] text-[#041E49] border-[#041E49]/10'; // Blue (Scheduled/Open)
    } else if (s.includes('process') || s.includes('working')) {
      return 'bg-[#FFEB3B]/30 text-[#625B00] border-[#625B00]/10'; // Yellow (In Progress)
    } else if (
      s.includes('done') ||
      s.includes('close') ||
      s.includes('finish')
    ) {
      return 'bg-[#C4EED0] text-[#0A3818] border-[#0A3818]/10'; // Green (Done)
    } else if (s.includes('pending')) {
      return 'bg-[#FFD8E4] text-[#31111D] border-[#31111D]/10'; // Red/Pink (Pending)
    }
    return 'bg-[#E6E0E9] text-[#49454F] border-[#49454F]/10'; // Default Gray
  };

  // --- FILTERING & SORTING LOGIC ---
  const filteredMaintenance = useMemo(() => {
    const safeData = (maintenanceTickets as MaintenanceTicket[]) || [];
    let data = [...safeData];

    // 1. Search Query
    if (query) {
      const q = query.toLowerCase();
      data = data.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.id.toString().includes(q) ||
          (t.siteId && t.siteId.toLowerCase().includes(q)) ||
          (t.troubleSource && t.troubleSource.toLowerCase().includes(q)),
      );
    }

    // 2. Filter Status
    if (filterStatus !== 'all') {
      // Normalisasi status agar pencocokan lebih fleksibel
      data = data.filter((t) => {
        const s = t.status.toLowerCase();
        if (filterStatus === 'schedule')
          return s.includes('schedule') || s.includes('open');
        if (filterStatus === 'process') return s.includes('process');
        if (filterStatus === 'closed')
          return (
            s.includes('close') || s.includes('done') || s.includes('finish')
          );
        return true;
      });
    }

    // 3. Sort Date
    data.sort((a, b) => {
      // Gunakan startTime (Jadwal) atau createdAt sebagai acuan sort
      const dateA = new Date(a.startTime || a.createdAt).getTime();
      const dateB = new Date(b.startTime || b.createdAt).getTime();
      return sortDate === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [maintenanceTickets, query, filterStatus, sortDate]);

  // --- PAGINATION LOGIC ---
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMaintenance.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMaintenance, currentPage]);

  const totalPages = Math.ceil(filteredMaintenance.length / itemsPerPage);

  // --- HANDLERS ---
  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedId) {
      const tid = toast.loading('Menghapus...');
      try {
        await deleteMaintenance(selectedId);
        toast.success('Tiket dihapus', { id: tid });
      } catch (e) {
        toast.error('Gagal menghapus', { id: tid });
      } finally {
        setIsDeleteOpen(false);
        setSelectedId(null);
      }
    }
  };

  // --- RENDER LOADING ---
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

  // --- RENDER MAIN CONTENT ---
  return (
    <div className="mt-4 space-y-4">
      {/* === FILTER BAR (Consistent M3) === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FEF7FF] p-4 rounded-[24px] border border-[#CAC4D0]/50 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-[#49454F]">
          <span className="bg-[#E8DEF8] text-[#1D192B] font-bold px-3 py-1 rounded-full text-xs">
            Total: {filteredMaintenance.length}
          </span>
          <span className="hidden sm:inline">Jadwal ditemukan</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Sort Date */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <ArrowUpDown size={14} className="text-[#6750A4]" />
            </div>
            <select
              value={sortDate}
              onChange={(e) => setSortDate(e.target.value)}
              className="appearance-none bg-[#F3EDF7] hover:bg-[#E8DEF8] transition-colors pl-9 pr-8 py-2.5 rounded-xl text-sm font-medium text-[#1D1B20] outline-none focus:ring-2 focus:ring-[#6750A4] cursor-pointer border-none min-w-[140px]"
            >
              <option value="desc">Jadwal Terbaru</option>
              <option value="asc">Jadwal Terlama</option>
            </select>
          </div>

          {/* Filter Status */}
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
              <option value="schedule">Scheduled / Open</option>
              <option value="process">In Progress</option>
              <option value="closed">Selesai / Done</option>
            </select>
          </div>
        </div>
      </div>

      {/* === TABLE SECTION === */}
      <div className="bg-[#FEF7FF] border border-[#CAC4D0] rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[#49454F] uppercase bg-[#F3EDF7] border-b border-[#E6E0E9]">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">
                  Maintenance Info
                </th>
                <th className="px-6 py-4 font-bold tracking-wider">Kategori</th>
                <th className="px-6 py-4 font-bold tracking-wider">
                  Jadwal Pengerjaan
                </th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E0E9]">
              {paginatedTickets.length > 0 ? (
                paginatedTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="group bg-[#FEF7FF] hover:bg-[#F3EDF7] transition-colors duration-200"
                  >
                    {/* KOLOM 1: INFO UTAMA */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {/* ID Badge */}
                        <span className="text-[10px] bg-[#E8DEF8] text-[#1D192B] px-1.5 py-0.5 rounded font-bold w-fit">
                          #{t.id}
                        </span>

                        {/* Title Link */}
                        <Link
                          href={`/operasional/tickets/maintenance/detail/${t.id}`}
                          className="font-semibold text-[#1C1B1F] text-base hover:text-[#6750A4] transition-colors line-clamp-1 block"
                        >
                          {t.title}
                        </Link>

                        {/* Sub Info (Site ID & Network Elements) */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium">
                          {t.siteId && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-[#6750A4]" />{' '}
                              {t.siteId}
                            </span>
                          )}
                          {/* Divider dot */}
                          {t.siteId && (t.networkElement || t.statusTx) && (
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          )}
                          {t.networkElement && (
                            <span className="flex items-center gap-1">
                              <Zap size={12} className="text-[#6750A4]" />{' '}
                              {t.networkElement}
                            </span>
                          )}
                          {t.statusTx && (
                            <span className="flex items-center gap-1">
                              <Activity size={12} className="text-[#6750A4]" />{' '}
                              {t.statusTx}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* KOLOM 2: SOURCE / CATEGORY */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {t.troubleSource ? (
                        <div className="flex items-center gap-2 text-[#1D1B20]">
                          <div className="bg-[#E6E0E9] p-1.5 rounded-full">
                            <ClipboardList
                              size={14}
                              className="text-[#49454F]"
                            />
                          </div>
                          <span className="text-xs font-semibold">
                            {t.troubleSource}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>

                    {/* KOLOM 3: JADWAL */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-[#49454F]">
                        <Calendar size={14} className="text-[#6750A4]" />
                        <span className="font-medium text-xs">
                          {formatDate(t.startTime)}
                        </span>
                      </div>
                    </td>

                    {/* KOLOM 4: STATUS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(t.status)}`}
                      >
                        {t.status}
                      </span>
                    </td>

                    {/* KOLOM 5: AKSI */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link
                          href={`/operasional/tickets/maintenance/${t.id}`}
                          className="p-2 text-[#49454F] bg-[#F2F2F2] hover:bg-[#E0E0E0] rounded-full transition-all border border-[#CAC4D0]/30"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          href={`/operasional/tickets/maintenance/edit/${t.id}`}
                          className="p-2 text-[#6750A4] bg-[#F3EDF7] hover:bg-[#E8DEF8] rounded-full transition-all border border-[#E8DEF8]"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </Link>

                        <button
                          onClick={() => handleDeleteClick(t.id)}
                          className="p-2 text-[#B3261E] bg-[#FFF8F6] hover:bg-[#FFDAD6] rounded-full transition-all border border-[#FFDAD6]"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // EMPTY STATE
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-[#49454F]">
                      <div className="bg-[#F3EDF7] p-4 rounded-full mb-3">
                        <Search size={24} className="text-[#CAC4D0]" />
                      </div>
                      <p className="font-medium">
                        Tidak ada jadwal maintenance ditemukan
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* === PAGINATION (Consistent M3) === */}
        {filteredMaintenance.length > 0 && (
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

      {/* === CONFIRM DIALOG === */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Hapus Maintenance?"
        message="Data jadwal ini akan dihapus permanen."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isDestructive
      />
    </div>
  );
}
