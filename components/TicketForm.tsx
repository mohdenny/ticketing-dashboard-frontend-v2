'use client';

import { useState, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { Ticket } from '@/types/ticket';

export default function TicketForm({ initialData }: { initialData?: Ticket }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [image, setImage] = useState<string | null>(initialData?.image || null);
  const [status, setStatus] = useState(initialData?.status || 'open');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!initialData;

  // Cek apakah ada perubahan data
  const isChanged = useMemo(() => {
    if (!isEdit) return title !== '' || description !== '';
    return (
      title !== initialData.title ||
      description !== initialData.description ||
      status !== initialData.status ||
      image !== initialData.image
    );
  }, [title, description, status, image, initialData, isEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && !isChanged) return;
    setLoading(true);
    const toastId = toast.loading('Processing...');

    try {
      const res = await fetch(
        isEdit ? `/api/tickets?id=${initialData.id}` : '/api/tickets',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, image, status }),
        },
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success(result.message, { id: toastId });
      if (!isEdit) {
        setTitle('');
        setDescription('');
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full border p-3 rounded-lg"
        placeholder="Judul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={loading}
      />
      {isEdit ? (
        <select
          className="w-full border p-3 rounded-lg bg-white"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          disabled={loading || initialData?.status === 'closed'}
        >
          {initialData?.status === 'open' && <option value="open">Open</option>}
          <option value="process">Process</option>
          <option value="closed">Closed</option>
        </select>
      ) : (
        <div className="w-full border p-3 rounded-lg bg-gray-50 text-gray-500 text-sm">
          Status: <strong>OPEN</strong>
        </div>
      )}
      <textarea
        className="w-full border p-3 rounded-lg h-32"
        placeholder="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        disabled={loading}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="w-full border p-3 rounded-lg text-sm"
        disabled={loading}
      />
      {image && (
        <img
          src={image}
          className="w-20 h-20 object-cover rounded-lg border"
          alt="Preview"
        />
      )}
      <button
        disabled={loading || (isEdit && !isChanged)}
        className="w-full bg-black text-white px-6 py-3 rounded-lg disabled:bg-gray-300"
      >
        {loading
          ? 'Processing...'
          : isEdit
            ? 'Simpan Perubahan'
            : 'Kirim Tiket'}
      </button>
    </form>
  );
}
