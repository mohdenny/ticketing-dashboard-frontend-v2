// app/tickets/edit/[id]/page.tsx
'use client';

import TicketForm from '@/components/TicketForm';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Ticket } from '@/types/ticket';

export default function EditTicketPage() {
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    // Ambil data lama untuk mengisi form
    fetch(`/api/tickets?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => setTicket(Array.isArray(data) ? data[0] : data));
  }, [params.id]);

  if (!ticket) return <p className="text-center py-10">Memuat data...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/tickets"
        className="text-sm text-blue-600 hover:underline mb-4 block"
      >
        ← Batal dan Kembali
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Edit Tiket #{ticket.id}
      </h1>
      {/* Kirim data lama ke form */}
      <TicketForm initialData={ticket} />
    </div>
  );
}
