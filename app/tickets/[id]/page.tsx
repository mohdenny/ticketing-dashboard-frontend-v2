'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Ticket } from '@/types/ticket';
import { toast } from 'sonner';
import Link from 'next/link';

export default function TicketDetailPage() {
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/tickets?id=${params.id}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) throw new Error();
        setTicket(data);
      })
      .catch(() => toast.error('Error'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="text-center py-10">Memuat...</p>;
  if (!ticket) return <p className="text-center py-10">Tidak ada.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
      <Link
        href="/tickets"
        className="text-sm text-blue-600 hover:underline mb-4 block"
      >
        ← Kembali
      </Link>
      <div className="bg-white border p-8 rounded-2xl shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {ticket.title}
              </h1>
              <span
                className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${ticket.status === 'open' ? 'bg-emerald-100 text-emerald-700' : ticket.status === 'process' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}
              >
                {ticket.status}
              </span>
            </div>
            <p className="text-xs font-mono text-gray-400">
              ID: #{ticket.id} •{' '}
              {new Date(ticket.createdAt).toLocaleString('id-ID')}
            </p>
          </div>
          <Link
            href={`/tickets/edit/${ticket.id}`}
            className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all"
          >
            Edit
          </Link>
        </div>
        <div className="space-y-3 mb-8">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Deskripsi
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>
        {ticket.image && (
          <div className="border-t pt-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase mb-3">
              Lampiran
            </h2>
            <img
              src={ticket.image}
              onClick={() => setSelectedImage(ticket.image!)}
              className="w-full max-w-md h-auto max-h-80 object-cover rounded-xl border cursor-zoom-in"
            />
            {ticket.updatedAt && (
              <p className="text-[10px] text-blue-500 italic mt-4 italic">
                Terakhir diupdate:{' '}
                {new Date(ticket.updatedAt).toLocaleString('id-ID')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
