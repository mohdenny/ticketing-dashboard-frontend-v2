'use client';

import { useState } from 'react';

export default function TicketForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    setTitle('');
    setDescription('');
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <input
        className="w-full border p-3 rounded-lg"
        placeholder="Judul ticket"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-3 rounded-lg"
        placeholder="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button className="bg-blue-500 text-white px-6 py3 rounded-lg">
        Buat Ticket
      </button>
    </form>
  );
}
