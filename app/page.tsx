'use client';

import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';

export default function Home() {
  // Ambil data user dari Redux untuk menyapa secara personal
  const user = useAppSelector((state) => state.user.data);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        Selamat Datang, {user ? user.email : 'Tamu'}!
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl">
        Ini adalah platform Ticketing System Anda. Kelola bantuan teknis, pantau
        status tiket, dan berikan solusi lebih cepat.
      </p>

      <div className="flex gap-4">
        <Link
          href="/tickets"
          className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
        >
          Lihat Semua Tiket
        </Link>

        {/* Tombol Buat Tiket Baru - Pastikan path folder aplikasi Anda sesuai (/tickets/create) */}
        <Link
          href="/tickets/create"
          className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
        >
          + Buat Tiket Baru
        </Link>
      </div>

      {/* Tampilkan statistik sederhana jika user adalah admin */}
      {user?.role === 'admin' && (
        <div className="mt-12 p-6 bg-purple-50 border border-purple-100 rounded-2xl">
          <p className="text-purple-700 font-medium">
            🛡️ Anda masuk sebagai <strong>Admin</strong>. Anda memiliki akses
            penuh ke manajemen tiket.
          </p>
        </div>
      )}
    </div>
  );
}
