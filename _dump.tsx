'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Edit3,
  Trash2,
  Calendar,
  Search,
  History,
  ArrowUpDown,
  Clock,
} from 'lucide-react';

// Interface Generik untuk T data apa saja
interface DataListProps<T> {
  data: T[];
  isLoading: boolean;
  onDelete: (id: string | number) => Promise<void>;
  query: string;
  baseUrl: string; // Contoh: '/tickets', '/maintenance', '/assets'
  // Mapping untuk menyesuaikan field dari data yang berbeda-beda
  mapping: {
    idKey: keyof T;
    titleKey: keyof T;
    descKey: keyof T;
    statusKey: keyof T;
    imageKey: keyof T;
    createdKey: keyof T;
    updatedKey: keyof T;
  };
}

export default function DataList<T>({
  data,
  isLoading,
  onDelete,
  query,
  baseUrl,
  mapping,
}: DataListProps<T>) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortDate, setSortDate] = useState('desc');

  const checkIsUpdated = (created?: any, updated?: any) => {
    if (!created || !updated) return false;
    return new Date(updated).getTime() - new Date(created).getTime() > 1000;
  };

  const filteredData = useMemo(() => {
    const safeData = data || [];
    let result = [...safeData];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter((item: any) =>
        item[mapping.titleKey]?.toString().toLowerCase().includes(q) ||
        item[mapping.idKey]?.toString().includes(q)
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter((item: any) => item[mapping.statusKey] === filterStatus);
    }

    result.sort((a: any, b: any) => {
      const dateA = new Date(a[mapping.createdKey]).getTime();
      const dateB = new Date(b[mapping.createdKey]).getTime();
      return sortDate === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [data, query, filterStatus, sortDate, mapping]);

  const handleDelete = async (id: string | number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    const tid = toast.loading('Menghapus...');
    try {
      await onDelete(id);
      toast.success('Data berhasil dihapus', { id: tid });
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus', { id: tid });
    }
  };

  if (isLoading) {
    return (
      <div className="mt-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 w-full bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <p className="text-sm text-gray-500 font-medium">
          Ditemukan <span className="text-black font-bold">{filteredData.length}</span> data
        </p>

        <div className="flex flex-wrap gap-2">
          <div className="relative flex items-center bg-white border border-gray-200 rounded-xl px-3 group focus-within:ring-2 focus-within:ring-[#6750A4]/20 transition-all">
            <ArrowUpDown size={14} className="text-gray-400 mr-2" />
            <select
              value={sortDate}
              onChange={(e) => setSortDate(e.target.value)}
              className="text-xs font-bold py-2.5 outline-none bg-transparent cursor-pointer"
            >
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-bold bg-white border border-gray-200 px-4 py-2.5 rounded-xl outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="open">Open</option>
            <option value="process">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <ul className="space-y-4">
          {filteredData.map((item: any) => {
            const id = item[mapping.idKey];
            const hasUpdate = checkIsUpdated(item[mapping.createdKey], item[mapping.updatedKey]);
            
            return (
              <li key={id} className="group border border-gray-100 p-4 rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row gap-5 relative transition-hover hover:border-[#6750A4]/30">
                <Link href={`${baseUrl}/${id}`} className="w-full sm:w-24 h-24 shrink-0 overflow-hidden rounded-xl border block bg-gray-50">
                  <img
                    src={item[mapping.imageKey] || 'https://placehold.co/400?text=No+Image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="data image"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-gray-100 text-gray-500">#{id}</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            item[mapping.statusKey] === 'open' ? 'bg-emerald-50 text-emerald-600' : 
                            item[mapping.statusKey] === 'process' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'
                          }`}>
                            {item[mapping.statusKey]}
                          </span>
                          {hasUpdate && (
                            <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[9px] font-black uppercase ring-1 ring-blue-100">
                              <History size={10} /> Edited
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#6750A4] transition-colors line-clamp-1">
                          <Link href={`${baseUrl}/${id}`}>{item[mapping.titleKey]}</Link>
                        </h3>
                      </div>

                      <div className="flex gap-1">
                        <Link href={`${baseUrl}/edit/${id}`} className="p-2 text-gray-400 hover:text-[#6750A4] hover:bg-[#F3EDF7] rounded-lg">
                          <Edit3 size={18} />
                        </Link>
                        <button onClick={() => handleDelete(id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-1 mt-1">{item[mapping.descKey]}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-6 text-[11px] text-gray-400 font-medium pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-emerald-500" />
                      <span>Dibuat: {new Date(item[mapping.createdKey]).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    {item[mapping.updatedKey] && hasUpdate && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-blue-500" />
                        <span>Update: {new Date(item[mapping.updatedKey]).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <Search className="text-gray-300 mx-auto mb-4" size={32} />
          <h3 className="text-gray-900 font-bold tracking-tight">Data tidak ditemukan</h3>
        </div>
      )}
    </div>
  );
}
