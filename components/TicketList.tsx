'use client';

import { useEffect, useState } from 'react';
import { Ticket } from '@/types/ticket';
import { toast } from 'sonner';
import Link from 'next/link';

export default function TicketList({ query }: { query: string }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortDate, setSortDate] = useState('desc');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/tickets', { cache: 'no-store' });
      let data: Ticket[] = await res.json();
      if (query)
        data = data.filter(
          (t) =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.id?.toString().includes(query),
        );
      if (filterStatus !== 'all')
        data = data.filter((t) => t.status === filterStatus);
      data.sort((a, b) =>
        sortDate === 'desc'
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      setTickets(data);
    } catch {
      toast.error('Gagal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query, filterStatus, sortDate]);

  const handleDelete = async (id: any) => {
    const tid = toast.loading('Menghapus...');
    try {
      await fetch(`/api/tickets?id=${id}`, { method: 'DELETE' });
      toast.success('Dihapus', { id: tid });
      setTickets((p) => p.filter((t) => t.id !== id));
    } catch {
      toast.error('Gagal', { id: tid });
    }
  };

  if (loading) return <p className="text-center py-10">Memuat...</p>;

  return (
    <div className="mt-6">
      <div className="flex justify-end mb-4 gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs border p-2 rounded-lg outline-none"
        >
          <option value="all">Semua Status</option>
          <option value="open">Open</option>
          <option value="process">Process</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={sortDate}
          onChange={(e) => setSortDate(e.target.value)}
          className="text-xs border p-2 rounded-lg outline-none"
        >
          <option value="desc">Terbaru</option>
          <option value="asc">Terlama</option>
        </select>
      </div>
      {tickets.length > 0 ? (
        <ul className="space-y-4">
          {tickets.map((t) => (
            <li
              key={t.id}
              className="border p-5 rounded-xl bg-white shadow-sm flex gap-5"
            >
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={t.image || '/no-image.png'}
                  className="w-full h-full object-cover rounded-lg border"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-gray-400">
                        #{t.id}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${t.status === 'open' ? 'bg-emerald-100 text-emerald-700' : t.status === 'process' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 hover:text-blue-600 transition-colors truncate">
                      <Link href={`/tickets/${t.id}`}>{t.title}</Link>
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/tickets/edit/${t.id}`}
                      className="text-blue-500 p-1 hover:bg-blue-50 rounded"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-500 p-1 hover:bg-red-50 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {t.description}
                </p>
                <div className="mt-2 text-[10px] text-gray-400 italic">
                  Dibuat: {new Date(t.createdAt).toLocaleString('id-ID')}{' '}
                  {t.updatedAt && (
                    <span className="text-blue-500">
                      • Diperbarui:{' '}
                      {new Date(t.updatedAt).toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-20 bg-white border-2 border-dashed rounded-2xl text-gray-400">
          Tidak ada tiket ditemukan.
        </div>
      )}
    </div>
  );
}
