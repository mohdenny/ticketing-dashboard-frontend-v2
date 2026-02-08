import TicketForm from '@/components/TicketForm';
import Link from 'next/link';

export default function CreateTicketPage() {
  return (
    // Container utama yang mengatur kerapihan (max-w-2xl)
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Link
        href="/tickets"
        className="text-sm text-blue-600 hover:underline mb-4 block"
      >
        ← Kembali ke Daftar Tiket
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Buat Tiket Baru</h1>

      {/* Form akan mengisi lebar container di atas */}
      <TicketForm />
    </div>
  );
}
