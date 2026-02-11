'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ticketSchema, TicketFormValues } from '@/schemas/ticketSchema';
import { Ticket } from '@/types/ticket';
import {
  Save,
  Send,
  Loader2,
  Image as ImageIcon,
  X,
  History,
  User,
  Users,
  Plus,
  Trash2,
} from 'lucide-react';
import { useState, ChangeEvent } from 'react';
import { useUsers } from '@/hooks/useTickets';

interface HistoryData {
  description: string;
  user: string;
  images?: string[];
  status: 'open' | 'process' | 'closed';
}

interface TicketFormProps {
  initialData?: Ticket;
  onSubmit: (data: TicketFormValues, history?: HistoryData) => void;
  isLoading?: boolean;
}

export default function TicketForm({
  initialData,
  onSubmit,
  isLoading,
}: TicketFormProps) {
  const { data: userList } = useUsers();
  const [isExternalUser, setIsExternalUser] = useState(false);
  const [mainImages, setMainImages] = useState<string[]>(
    initialData?.images || [],
  );
  const [updateImages, setUpdateImages] = useState<string[]>([]);

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
      status: initialData ? (initialData.status as any) : 'open',
      images: initialData?.images || [],
      historyNote: '',
      assignedUser: '',
      historyImages: [],
    },
  });

  const currentStatus = watch('status');

  const handleFileSelect = (
    e: ChangeEvent<HTMLInputElement>,
    target: 'main' | 'update',
  ) => {
    const files = e.target.files;
    if (!files) return;

    const currentImages = target === 'main' ? mainImages : updateImages;
    const remainingSlots = 5 - currentImages.length;

    if (files.length > remainingSlots) {
      alert(
        `Maksimal 5 foto. Anda hanya bisa menambah ${remainingSlots} foto lagi.`,
      );
      return;
    }

    const newImagesPromises: Promise<string>[] = [];

    Array.from(files).forEach((file) => {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert(`File ${file.name} bukan format JPG/PNG.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar (Max 5MB).`);
        return;
      }

      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newImagesPromises.push(promise);
    });

    Promise.all(newImagesPromises).then((base64Images) => {
      if (target === 'main') {
        const updated = [...mainImages, ...base64Images];
        setMainImages(updated);
        setValue('images', updated);
      } else {
        const updated = [...updateImages, ...base64Images];
        setUpdateImages(updated);
        setValue('historyImages', updated);
      }
    });

    e.target.value = '';
  };

  const removeImage = (index: number, target: 'main' | 'update') => {
    if (target === 'main') {
      const updated = mainImages.filter((_, i) => i !== index);
      setMainImages(updated);
      setValue('images', updated);
    } else {
      const updated = updateImages.filter((_, i) => i !== index);
      setUpdateImages(updated);
      setValue('historyImages', updated);
    }
  };

  const onFormSubmit = (data: TicketFormValues) => {
    let historyPayload: HistoryData | undefined;

    if (initialData && data.historyNote && data.assignedUser) {
      historyPayload = {
        description: data.historyNote,
        user: data.assignedUser,
        images: updateImages,
        status: data.status,
      };
    }

    const finalData = { ...data, images: mainImages };
    onSubmit(finalData, historyPayload);
  };

  const attachmentSection = (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#49454F] ml-1">
        Lampiran Awal {initialData ? '(Tidak bisa diedit)' : '(Maks. 5 Foto)'}
      </label>

      {/* Grid Preview Foto Utama */}
      {mainImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-3">
          {mainImages.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
            >
              <img
                src={img}
                alt={`lampiran-${idx}`}
                className="w-full h-full object-cover"
              />
              {!initialData && (
                <button
                  type="button"
                  onClick={() => removeImage(idx, 'main')}
                  className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tombol Upload Utama */}
      {!initialData && mainImages.length < 5 && (
        <label className="flex flex-col items-center justify-center w-full h-[120px] border-2 border-dashed border-[#CAC4D0] rounded-[24px] cursor-pointer hover:bg-[#6750A4]/5 hover:border-[#6750A4] transition-all">
          <div className="flex flex-col items-center justify-center pt-4 pb-4 text-center">
            <ImageIcon size={24} className="text-[#49454F] mb-1" />
            <p className="text-xs text-[#49454F] font-medium">
              Upload Foto Masalah
            </p>
            <p className="text-[9px] text-gray-400">JPG/PNG, Max 5MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            multiple
            onChange={(e) => handleFileSelect(e, 'main')}
          />
        </label>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6"
    >
      <div className="space-y-6">
        {/* Subjek */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#49454F] ml-1">
            Subjek Laporan
          </label>
          <input
            {...register('title')}
            disabled={isLoading || !!initialData}
            placeholder="Apa kendala Anda?"
            className={`w-full px-5 py-4 rounded-[16px] border bg-transparent outline-none transition-all ${
              errors.title
                ? 'border-[#B3261E]'
                : 'border-[#79747E] focus:border-[#6750A4]'
            } ${
              initialData
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                : ''
            }`}
          />
          {errors.title && (
            <p className="text-xs text-[#B3261E] mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Deskripsi */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#49454F] ml-1">
            Detail Masalah
          </label>
          <textarea
            {...register('description')}
            disabled={isLoading || !!initialData}
            rows={8}
            placeholder="Ceritakan detail masalah..."
            className={`w-full px-5 py-4 rounded-[16px] border bg-transparent outline-none transition-all resize-none ${
              errors.description
                ? 'border-[#B3261E]'
                : 'border-[#79747E] focus:border-[#6750A4]'
            } ${
              initialData
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200'
                : ''
            }`}
          />
          {errors.description && (
            <p className="text-xs text-[#B3261E] mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {initialData && attachmentSection}
      </div>

      <div className="space-y-6">
        {/* Status Tiket */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#49454F] ml-1">
            Status Tiket
          </label>
          <div className="relative">
            <select
              {...register('status')}
              disabled={isLoading || !initialData}
              className={`w-full px-5 py-4 rounded-[16px] border appearance-none bg-white outline-none font-medium transition-colors ${
                !initialData
                  ? 'border-dashed border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
                  : 'border-[#79747E] focus:border-[#6750A4] text-[#1D1B20]'
              }`}
            >
              {!initialData ? (
                <option value="open">Open (Default)</option>
              ) : (
                <>
                  <option value="open">Open</option>
                  <option value="process">In Progress</option>
                  <option value="closed">Closed</option>
                </>
              )}
            </select>
          </div>
          {!initialData && (
            <p className="text-[10px] text-gray-500 ml-1 italic">
              * Status otomatis "Open" untuk tiket baru.
            </p>
          )}
        </div>

        {!initialData && attachmentSection}

        {/* Form Update History (Hanya saat Edit) */}
        {initialData && (
          <div
            className={`p-5 rounded-[24px] border space-y-4 animate-in fade-in slide-in-from-top-2 transition-colors ${
              currentStatus !== 'open'
                ? 'bg-[#F3F0F9] border-[#E8DEF8]'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2 text-[#6750A4] mb-1">
              <History size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Update Progress
              </h3>
            </div>

            {/* Input Catatan */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#49454F] ml-1">
                Catatan Pengerjaan{' '}
                {currentStatus !== 'open' && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <textarea
                {...register('historyNote')}
                placeholder={
                  currentStatus === 'open'
                    ? 'Opsional...'
                    : 'Wajib diisi: Progres perbaikan...'
                }
                rows={2}
                className={`w-full px-4 py-3 rounded-[12px] border bg-white text-sm outline-none focus:border-[#6750A4] ${
                  errors.historyNote ? 'border-[#B3261E]' : 'border-[#CAC4D0]'
                }`}
              />
              {errors.historyNote && (
                <p className="text-xs text-[#B3261E] ml-1">
                  {errors.historyNote.message}
                </p>
              )}
            </div>

            {/* Input Teknisi */}
            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-medium text-[#49454F]">
                  Nama Teknisi / PIC{' '}
                  {currentStatus !== 'open' && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsExternalUser(!isExternalUser);
                    setValue('assignedUser', '');
                  }}
                  className="text-[10px] text-[#6750A4] hover:underline"
                >
                  {isExternalUser ? 'Pilih dari List' : 'Input Manual (Luar)'}
                </button>
              </div>
              <div className="relative">
                {isExternalUser ? (
                  <>
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      {...register('assignedUser')}
                      placeholder="Tulis nama..."
                      className={`w-full pl-9 pr-4 py-3 rounded-[12px] border bg-white text-sm outline-none focus:border-[#6750A4] ${
                        errors.assignedUser
                          ? 'border-[#B3261E]'
                          : 'border-[#CAC4D0]'
                      }`}
                    />
                  </>
                ) : (
                  <>
                    <Users
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <select
                      {...register('assignedUser')}
                      className={`w-full pl-9 pr-4 py-3 rounded-[12px] border bg-white text-sm outline-none focus:border-[#6750A4] appearance-none cursor-pointer ${
                        errors.assignedUser
                          ? 'border-[#B3261E]'
                          : 'border-[#CAC4D0]'
                      }`}
                    >
                      <option value="">-- Pilih Teknisi --</option>
                      {userList?.map((u) => (
                        <option key={u.id} value={u.name}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
              {errors.assignedUser && (
                <p className="text-xs text-[#B3261E] ml-1">
                  {errors.assignedUser.message}
                </p>
              )}
            </div>

            {/* Lampiran Update */}
            <div className="space-y-2 pt-2 border-t border-gray-200/50">
              <label className="text-xs font-medium text-[#49454F] ml-1 flex justify-between">
                <span>Foto Update (Opsional)</span>
                <span className="text-gray-400">{updateImages.length}/5</span>
              </label>

              {updateImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {updateImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={img}
                        alt={`update-${idx}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx, 'update')}
                        className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 shadow-sm hover:scale-110 transition-transform"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {updateImages.length < 5 && (
                <label className="flex items-center justify-center w-full py-3 border border-dashed border-[#6750A4]/30 rounded-[12px] cursor-pointer hover:bg-[#6750A4]/5 transition-all text-[#6750A4] gap-2">
                  <Plus size={16} />
                  <span className="text-xs font-semibold">Tambah Foto</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                    multiple
                    onChange={(e) => handleFileSelect(e, 'update')}
                  />
                </label>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- BUTTON SUBMIT --- */}
      <div className="lg:col-span-2 flex justify-end mt-4 pt-4 border-t border-gray-100 lg:border-none">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full lg:w-auto min-w-[200px] flex items-center justify-center gap-2 py-3 px-8 rounded-full bg-[#6750A4] text-white font-semibold shadow-md hover:shadow-lg hover:bg-[#7E64C2] transition-all active:scale-[0.98] disabled:bg-[#E6E0E9] disabled:text-[#938F99] disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : initialData ? (
            <>
              <Save size={18} /> <span>Simpan & Update</span>
            </>
          ) : (
            <>
              <Send size={18} /> <span>Kirim Tiket</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
