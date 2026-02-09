'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ticketSchema, TicketFormValues } from '@/schemas/ticketSchema';
import { Ticket } from '@/types/ticket';
import { Save, Send, Loader2, Image as ImageIcon, X } from 'lucide-react';
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
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData ? (initialData.status as any) : 'open',
      image: initialData?.image || null,
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        setValue('image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setValue('image', null);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6"
    >
      {/* --- BAGIAN KIRI --- */}
      <div className="space-y-6">
        {/* Subjek Laporan */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#49454F] ml-1">
            Subjek Laporan
          </label>
          <input
            {...register('title')}
            disabled={isLoading}
            placeholder="Apa kendala Anda?"
            className={`w-full px-5 py-4 rounded-[16px] border bg-transparent outline-none transition-all ${
              errors.title
                ? 'border-[#B3261E]'
                : 'border-[#79747E] focus:border-[#6750A4]'
            }`}
          />
          {errors.title && (
            <p className="text-xs text-[#B3261E] mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Detail Masalah */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#49454F] ml-1">
            Detail Masalah
          </label>
          <textarea
            {...register('description')}
            disabled={isLoading}
            rows={8}
            placeholder="Ceritakan detail masalah yang dialami..."
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
      </div>

      {/* --- BAGIAN KANAN --- */}
      <div className="space-y-6">
        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#49454F] ml-1">
            Status
          </label>
          <select
            {...register('status')}
            disabled={isLoading || !initialData}
            className={`w-full px-5 py-4 rounded-[16px] border border-[#79747E] bg-white outline-none focus:border-[#6750A4] ${
              !initialData ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''
            }`}
          >
            {!initialData ? (
              <option value="open">Open</option>
            ) : (
              <>
                <option value="open">Open</option>
                <option value="process">In Progress</option>
                <option value="closed">Closed</option>
              </>
            )}
          </select>
          {!initialData && (
            <p className="text-[10px] text-gray-500 ml-1 italic">
              * Tiket baru akan otomatis berstatus Open.
            </p>
          )}
        </div>

        {/* Lampiran Foto */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#49454F] ml-1">
            Lampiran Foto
          </label>
          <div className="flex flex-col items-center justify-center w-full">
            {preview ? (
              <div className="relative w-full h-[218px] rounded-[24px] overflow-hidden border border-[#E6E0E9]">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-[#B3261E] shadow-lg transition-transform active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-[218px] border-2 border-dashed border-[#79747E] rounded-[24px] cursor-pointer hover:bg-[#6750A4]/5 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon size={32} className="text-[#49454F] mb-2" />
                  <p className="text-sm text-[#49454F]">
                    Klik untuk upload foto
                  </p>
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
      </div>

      {/* --- TOMBOL (FULL WIDTH DI MOBILE, POJOK KANAN DI DESKTOP) --- */}
      <div className="lg:col-span-2 flex justify-end mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full lg:w-fit lg:min-w-[220px] flex items-center justify-center gap-3 py-4 px-10 rounded-full bg-[#6750A4] text-white font-bold shadow-md hover:bg-[#7E64C2] transition-all active:scale-[0.98] disabled:bg-[#E6E0E9] disabled:text-[#938F99] disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : initialData ? (
            <Save size={20} />
          ) : (
            <Send size={20} />
          )}
          <span>{initialData ? 'Simpan Perubahan' : 'Kirim Laporan'}</span>
        </button>
      </div>
    </form>
  );
}
