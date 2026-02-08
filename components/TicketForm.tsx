'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TicketForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return alert('Harap isi semua bidang!');

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        // Pindah ke halaman list dan segarkan data
        router.push('/tickets');
        router.refresh();
      }
    } catch (error) {
      alert('Gagal membuat tiket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-sm border space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Judul Tiket
        </label>
        <input
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="Contoh: Masalah Koneksi VPN"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi Detail
        </label>
        <textarea
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32"
          placeholder="Jelaskan masalah Anda secara detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400"
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Tiket Sekarang'}
      </button>
    </form>
  );
}
