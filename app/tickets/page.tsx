import TicketList from '@/components/TicketList';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function TicketsPage({ searchParams }: PageProps) {
  // Menangkap keyword pencarian global dari URL (?q=...)
  const query = (await searchParams).q || '';

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tiket Anda</h1>
          <p className="text-gray-500">
            Kelola dan pantau status tiket bantuan Anda.
          </p>
        </div>
        <Link
          href="/tickets/create"
          className="bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-all"
        >
          + Buat Tiket Baru
        </Link>
      </div>

      {/* Komponen Client yang menangani daftar, edit, hapus, dan detail */}
      <TicketList query={query} />
    </section>
  );
}
