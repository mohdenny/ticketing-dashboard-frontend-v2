'use client';

import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/user/userSlice';
import { useTrouble } from '@/hooks/tickets';
import Link from 'next/link';
import TicketStatCard from '@/components/modules/tickets/trouble/TroubleStatCard';
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';

export default function DashboardPage() {
  const user = useAppSelector(selectUser);
  const { tickets, isLoading } = useTrouble();

  const stats = {
    total: tickets?.length || 0,
    open: tickets?.filter((t) => t.status === 'open').length || 0,
    process: tickets?.filter((t) => t.status === 'process').length || 0,
    closed: tickets?.filter((t) => t.status === 'closed').length || 0,
  };

  return (
    <div className="p-8 max-w-7xl mx-auto lg:w-full min-h-screen">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#6750A4] mb-2 font-medium">
            <LayoutDashboard size={18} />
            <span className="text-xs uppercase tracking-widest">
              Dashboard Overview
            </span>
          </div>
          <h1 className="text-[32px] font-bold text-[#1C1B1F] tracking-tight">
            Selamat Datang, {user?.name || 'Pengguna'}
          </h1>
          <p className="text-[#49454F] mt-1">
            Pantau progres dan kelola semua tiket laporan Anda di sini.
          </p>
        </div>

        <Link
          href="operational/tickets/create"
          className="flex items-center gap-2 bg-[#6750A4] text-white px-8 py-4 rounded-full shadow-sm hover:shadow-lg active:scale-95 transition-all font-bold text-sm"
        >
          <Plus size={20} />
          Buat Laporan Baru
        </Link>
      </header>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {isLoading ? (
            // Skeleton loading state
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-[#E6E0E9] animate-pulse rounded-[28px]"
              />
            ))
          ) : (
            <>
              <TicketStatCard
                title="Total Laporan"
                count={stats.total}
                icon={<Ticket size={24} />}
                color="bg-[#F3EDF7] text-[#21005D]"
                description="Seluruh tiket terdaftar"
              />
              <TicketStatCard
                title="Open"
                count={stats.open}
                icon={<AlertCircle size={24} />}
                color="bg-[#FFDAD6] text-[#410002]"
                description="Menunggu antrean"
              />
              <TicketStatCard
                title="Dalam Proses"
                count={stats.process}
                icon={<Clock size={24} />}
                color="bg-[#EADDFF] text-[#21005D]"
                description="Sedang dikerjakan"
              />
              <TicketStatCard
                title="Selesai"
                count={stats.closed}
                icon={<CheckCircle2 size={24} />}
                color="bg-[#D3E4FF] text-[#001D36]"
                description="Masalah terselesaikan"
              />
            </>
          )}
        </div>

        {/* Recent Activity Section */}
        <section className="bg-white rounded-[28px] p-8 border border-[#E6E0E9] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#1C1B1F]">
              Aktivitas Terakhir
            </h2>
            <Link
              href="operational/tickets"
              className="text-sm font-bold text-[#6750A4] flex items-center gap-1 hover:underline"
            >
              Lihat Semua <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-[#F3EDF7] animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : tickets.length > 0 ? (
            <div className="divide-y divide-[#E6E0E9]">
              {tickets.slice(0, 5).map((ticket) => (
                <div
                  key={ticket.id}
                  className="py-4 flex items-center justify-between hover:bg-zinc-50 transition-colors px-2 rounded-xl"
                >
                  <div className="flex gap-4 items-center">
                    <div
                      className={`p-3 rounded-full ${
                        ticket.status === 'open'
                          ? 'bg-[#FFDAD6]'
                          : ticket.status === 'process'
                            ? 'bg-[#EADDFF]'
                            : 'bg-[#D3E4FF]'
                      }`}
                    >
                      <Ticket size={20} className="text-[#1C1B1F]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1C1B1F]">{ticket.title}</p>
                      <p className="text-xs text-[#49454F]">
                        {new Date(ticket.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 bg-[#F3EDF7] rounded-full">
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-[#F3EDF7] rounded-full flex items-center justify-center text-[#49454F] mb-2">
                <Ticket size={32} strokeWidth={1} />
              </div>
              <p className="font-medium text-[#1C1B1F]">
                Belum ada aktivitas tiket
              </p>
              <p className="text-sm text-[#49454F]">
                Tiket yang Anda buat akan muncul di sini.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
