'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ticketSchema, TicketFormValues } from '@/schemas/ticketSchema';
import { Ticket } from '@/types/ticket';
import {
  AlertCircle,
  Save,
  Send,
  Loader2,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useState, ChangeEvent } from 'react';

interface TicketFormProps {
  initialData?: Ticket;
  onSubmit: (data: TicketFormValues) => void;
  isLoading?: boolean;
}

export default function TicketForm({
  initialData,
  onSubmit,
  isLoading,
}: TicketFormProps) {
  const [preview, setPreview] = useState<string | null>(
    initialData?.image || null,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: (initialData?.status as any) || 'open',
      image: initialData?.image || null,
    },
  });

  // Fungsi handle upload foto (convert ke Base64 untuk Mock Data)
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        setValue('image', base64String); // Memasukkan ke react-hook-form
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setValue('image', null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Input Judul */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#49454F] ml-1">
          Subjek Laporan
        </label>
        <input
          {...register('title')}
          disabled={isLoading}
          className={`w-full px-5 py-4 rounded-[16px] border bg-transparent outline-none transition-all ${
            errors.title
              ? 'border-[#B3261E]'
              : 'border-[#79747E] focus:border-[#6750A4]'
          }`}
        />
        {errors.title && (
          <p className="text-xs text-[#B3261E] mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Input Deskripsi */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#49454F] ml-1">
          Detail Masalah
        </label>
        <textarea
          {...register('description')}
          disabled={isLoading}
          rows={4}
          className={`w-full px-5 py-4 rounded-[16px] border bg-transparent outline-none transition-all resize-none ${
            errors.description
              ? 'border-[#B3261E]'
              : 'border-[#79747E] focus:border-[#6750A4]'
          }`}
        />
        {errors.description && (
          <p className="text-xs text-[#B3261E] mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Upload Foto Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#49454F] ml-1">
          Lampiran Foto
        </label>
        <div className="flex flex-col items-center justify-center w-full">
          {preview ? (
            <div className="relative w-full h-64 rounded-[24px] overflow-hidden border border-[#E6E0E9]">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-[#B3261E] shadow-lg"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#79747E] rounded-[24px] cursor-pointer hover:bg-[#6750A4]/5 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon size={32} className="text-[#49454F] mb-2" />
                <p className="text-sm text-[#49454F]">Klik untuk upload foto</p>
                <p className="text-xs text-[#938F99]">PNG, JPG atau WEBP</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Input Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#49454F] ml-1">
          Status
        </label>
        <select
          {...register('status')}
          className="w-full px-5 py-4 rounded-[16px] border border-[#79747E] bg-white outline-none focus:border-[#6750A4]"
        >
          <option value="open">Open</option>
          <option value="process">In Process</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-[#6750A4] text-white font-bold shadow-md hover:bg-[#7E64C2] disabled:bg-[#E6E0E9]"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : initialData ? (
          <Save size={20} />
        ) : (
          <Send size={20} />
        )}
        <span>{initialData ? 'Update Tiket' : 'Kirim Laporan'}</span>
      </button>
    </form>
  );
}
