'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { troubleSchema, TroubleFormValues } from '@/schemas/tickets/trouble';
import {
  Save,
  Send,
  Loader2,
  Image as ImageIcon,
  X,
  History,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Zap,
  Activity,
  Clock,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { useState, ChangeEvent } from 'react';
import { useUsers } from '@/hooks/tickets/useTrouble';

// --- TYPE DEFINITIONS ---
// Definisikan tipe untuk props sub-komponen agar tidak 'any'
interface SubComponentProps {
  readOnly?: boolean;
  errors?: any; // Bisa diperbaiki dengan FieldErrors<TroubleFormValues> jika ingin lebih strict
}

interface AttachmentSectionProps extends SubComponentProps {
  images: string[];
  target: 'main' | 'update';
  onRemove: (index: number, target: 'main' | 'update') => void;
  onUpload: (
    e: ChangeEvent<HTMLInputElement>,
    target: 'main' | 'update',
  ) => void;
}

interface ReporterBadgesProps extends SubComponentProps {
  list: string[];
  onRemove: (index: number) => void;
}

interface ReporterInputProps {
  isExternal: boolean;
  onAdd: (value: string) => void;
  onAddExternal: () => void;
  onCancelExternal: () => void;
  externalValue: string;
  setExternalValue: (val: string) => void;
  error?: string;
  userList?: any[]; // Sesuaikan dengan tipe userList dari hook Anda
}

interface TroubleFormProps {
  initialData?: Partial<TroubleFormValues> & { status?: string }; // Lebih aman daripada 'any'
  onSubmit: (data: TroubleFormValues) => void;
  isLoading?: boolean;
}

// --- SUB-COMPONENTS (DIPINDAHKAN KE LUAR) ---

const AttachmentSection = ({
  images,
  target,
  readOnly = false,
  onRemove,
  onUpload,
}: AttachmentSectionProps) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-[#49454F] mb-2 block tracking-wide">
      {target === 'main' ? 'Lampiran Awal' : 'Foto Update'}
      <span className="text-xs text-[#79747E] ml-2 font-normal">
        ({images.length}/5)
      </span>
    </label>
    {images.length > 0 && (
      <div className="grid grid-cols-3 gap-3 mb-2">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-[12px] overflow-hidden border border-[#CAC4D0] group bg-white"
          >
            <img
              src={img}
              alt="preview"
              className="w-full h-full object-cover"
            />
            {!readOnly && (
              <button
                type="button"
                onClick={() => onRemove(idx, target)}
                className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-[#B3261E] hover:bg-[#F2B8B5] transition-colors shadow-sm"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    )}
    {!readOnly && images.length < 5 && (
      <label className="flex flex-col items-center justify-center w-full h-[100px] border border-dashed border-[#79747E] rounded-[12px] cursor-pointer hover:bg-[#F3EDF7] transition-all bg-[#F3EDF7]/30">
        <div className="flex flex-col items-center justify-center py-2 text-[#6750A4]">
          <ImageIcon size={24} className="mb-1" />
          <p className="text-xs font-medium">Upload Foto</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={(e) => onUpload(e, target)}
        />
      </label>
    )}
  </div>
);

const ReporterBadges = ({ list, onRemove, readOnly }: ReporterBadgesProps) => (
  <div className="flex flex-wrap gap-2 mb-3">
    {list.map((rep, idx) => (
      <span
        key={idx}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm font-medium border transition-colors ${
          readOnly
            ? 'bg-[#E7E0EC] text-[#49454F] border-[#CAC4D0]'
            : 'bg-[#E8DEF8] text-[#1D192B] border-[#E8DEF8] hover:shadow-sm'
        }`}
      >
        <User size={14} />
        {rep}
        {!readOnly && (
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="text-[#1D192B] hover:text-[#B3261E] transition-colors rounded-full p-0.5"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </span>
    ))}
    {readOnly && list.length === 0 && (
      <span className="text-sm text-[#79747E] italic py-1">
        - Tidak ada data -
      </span>
    )}
  </div>
);

const ReporterInput = ({
  isExternal,
  onAdd,
  onAddExternal,
  onCancelExternal,
  externalValue,
  setExternalValue,
  error,
  userList,
}: ReporterInputProps) => {
  const inputClass = (err?: any) =>
    `w-full px-4 py-3 rounded-[12px] border text-[#1D1B20] outline-none transition-all placeholder:text-[#49454F]/50 appearance-none ${err ? 'border-[#B3261E] focus:border-[#B3261E] focus:ring-1 focus:ring-[#B3261E] bg-red-50/10' : 'border-[#79747E] bg-white hover:border-[#49454F] focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]'}`;

  return (
    <div className="space-y-1">
      {!isExternal ? (
        <div className="relative group">
          <select
            onChange={(e) => onAdd(e.target.value)}
            className={inputClass(error)}
            defaultValue=""
          >
            <option value="" disabled>
              + Tambah User...
            </option>
            {userList?.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name} ({u.role})
              </option>
            ))}
            <option
              value="external"
              className="font-bold text-[#6750A4] bg-[#F3EDF7]"
            >
              + Orang Luar / Lainnya
            </option>
          </select>
          <Users
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none group-hover:text-[#49454F]"
            size={20}
          />
        </div>
      ) : (
        <div className="flex gap-2 animate-in fade-in zoom-in-95 duration-200">
          <input
            autoFocus
            placeholder="Nama teknisi..."
            value={externalValue}
            onChange={(e) => setExternalValue(e.target.value)}
            className={inputClass(error)}
          />
          <button
            type="button"
            onClick={onAddExternal}
            className="bg-[#6750A4] text-white px-4 rounded-[12px] hover:bg-[#523E85] transition-colors shadow-sm"
          >
            <CheckCircle2 size={24} />
          </button>
          <button
            type="button"
            onClick={onCancelExternal}
            className="bg-[#F3EDF7] text-[#1D1B20] px-3 rounded-[12px] hover:bg-[#E7E0EC] transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      )}
      {error && (
        <p className="text-xs text-[#B3261E] mt-1 ml-1 font-medium">{error}</p>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

export default function TroubleForm({
  initialData,
  onSubmit,
  isLoading,
}: TroubleFormProps) {
  const { data: userList } = useUsers();

  // Helper Classes (Tetap di sini tidak apa-apa karena hanya string, atau pindah ke luar juga boleh)
  const inputClass = (error?: any) =>
    `w-full px-4 py-3 rounded-[12px] border text-[#1D1B20] outline-none transition-all placeholder:text-[#49454F]/50 appearance-none ${error ? 'border-[#B3261E] focus:border-[#B3261E] focus:ring-1 focus:ring-[#B3261E] bg-red-50/10' : 'border-[#79747E] bg-white hover:border-[#49454F] focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]'}`;
  const labelClass =
    'text-sm font-medium text-[#49454F] mb-2 block tracking-wide';
  const errorClass = 'text-xs text-[#B3261E] mt-1 ml-1 font-medium';

  const [isExternalInput, setIsExternalInput] = useState(false);
  const [externalName, setExternalName] = useState('');
  const [isUpdateExternalInput, setIsUpdateExternalInput] = useState(false);
  const [updateExternalName, setUpdateExternalName] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TroubleFormValues>({
    resolver: zodResolver(troubleSchema),
    defaultValues: {
      title: initialData?.title || '',
      siteId: initialData?.siteId || '',
      description: initialData?.description || '',
      status:
        ((initialData?.status === 'open'
          ? 'process'
          : initialData?.status) as any) || 'open',
      priority: initialData?.priority || 'Minor',
      images: initialData?.images || [],
      startTime: initialData?.startTime || '',
      runHours: initialData?.runHours || '',
      statusTx: initialData?.statusTx || '',
      duration: initialData?.duration || '',
      reporters: initialData?.reporters || [],
      updateDescription: '',
      updateReporters: [],
      updateImages: [],
    },
  });

  const watchedReporters = watch('reporters') || [];
  const watchedUpdateReporters = watch('updateReporters') || [];
  const watchedMainImages = watch('images') || [];
  const watchedUpdateImages = watch('updateImages') || [];

  // Logic handlers (Sama seperti sebelumnya)
  const handleAddReporter = (value: string) => {
    if (value === 'external') {
      setIsExternalInput(true);
      return;
    }
    if (value && !watchedReporters.includes(value))
      setValue('reporters', [...watchedReporters, value], {
        shouldValidate: true,
      });
  };

  const handleAddExternalReporter = () => {
    if (externalName.trim()) {
      const name = `${externalName} (Ext)`;
      if (!watchedReporters.includes(name))
        setValue('reporters', [...watchedReporters, name], {
          shouldValidate: true,
        });
      setExternalName('');
      setIsExternalInput(false);
    }
  };

  const removeReporter = (index: number) => {
    setValue(
      'reporters',
      watchedReporters.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const handleAddUpdateReporter = (value: string) => {
    if (value === 'external') {
      setIsUpdateExternalInput(true);
      return;
    }
    if (value && !watchedUpdateReporters.includes(value))
      setValue('updateReporters', [...watchedUpdateReporters, value], {
        shouldValidate: true,
      });
  };

  const handleAddUpdateExternalReporter = () => {
    if (updateExternalName.trim()) {
      const name = `${updateExternalName} (Ext)`;
      if (!watchedUpdateReporters.includes(name))
        setValue('updateReporters', [...watchedUpdateReporters, name], {
          shouldValidate: true,
        });
      setUpdateExternalName('');
      setIsUpdateExternalInput(false);
    }
  };

  const removeUpdateReporter = (index: number) => {
    setValue(
      'updateReporters',
      watchedUpdateReporters.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const handleFileSelect = (
    e: ChangeEvent<HTMLInputElement>,
    target: 'main' | 'update',
  ) => {
    const files = e.target.files;
    if (!files) return;
    const currentImages =
      target === 'main' ? watchedMainImages : watchedUpdateImages;

    if (files.length + currentImages.length > 5)
      return alert(`Maksimal 5 foto.`);

    const newImagesPromises: Promise<string>[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return alert('File Max 5MB');
      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newImagesPromises.push(promise);
    });

    Promise.all(newImagesPromises).then((base64Images) => {
      const fieldName = target === 'main' ? 'images' : 'updateImages';
      setValue(fieldName, [...currentImages, ...base64Images], {
        shouldValidate: true,
      });
    });
    e.target.value = '';
  };

  const removeImage = (index: number, target: 'main' | 'update') => {
    const fieldName = target === 'main' ? 'images' : 'updateImages';
    const currentList =
      target === 'main' ? watchedMainImages : watchedUpdateImages;
    setValue(
      fieldName,
      currentList.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  // Technical Fields component juga sebaiknya dipisah, tapi jika ingin di dalam,
  // pastikan dia tidak re-render berat. Di sini saya pindahkan ke dalam render function langsung
  // agar tidak jadi komponen terpisah yang didefinisikan ulang, melainkan hanya JSX biasa.
  const renderTechnicalFields = (readOnly: boolean) => (
    <div
      className={`space-y-6 ${readOnly ? 'opacity-70 pointer-events-none grayscale-[0.5]' : ''}`}
    >
      <div>
        <label className={labelClass}>Run Hours</label>
        <div className="relative">
          <input
            {...register('runHours')}
            placeholder="1245.5"
            disabled={readOnly}
            className={inputClass(errors.runHours)}
          />
          {!readOnly && (
            <Zap
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
              size={20}
            />
          )}
        </div>
        {errors.runHours && (
          <p className={errorClass}>{errors.runHours.message as string}</p>
        )}
      </div>
      <div>
        <label className={labelClass}>Status TX</label>
        <div className="relative">
          <select
            {...register('statusTx')}
            disabled={readOnly}
            className={inputClass(errors.statusTx)}
          >
            <option value="">-- Pilih --</option>
            <option value="On Air">On Air</option>
            <option value="Off Air">Off Air</option>
            <option value="Degraded">Degraded</option>
          </select>
          {!readOnly && (
            <Activity
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#79747E]"
              size={20}
            />
          )}
        </div>
        {errors.statusTx && (
          <p className={errorClass}>{errors.statusTx.message as string}</p>
        )}
      </div>
      <div>
        <label className={labelClass}>Durasi TX-OFF</label>
        <div className="relative">
          <input
            {...register('duration')}
            placeholder="00:00"
            disabled={readOnly}
            className={inputClass(errors.duration)}
          />
          {!readOnly && (
            <Clock
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
              size={20}
            />
          )}
        </div>
        {errors.duration && (
          <p className={errorClass}>{errors.duration.message as string}</p>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
      {/* HEADER */}
      <div className="mb-6 pb-4 border-b border-[#CAC4D0] flex justify-between items-center">
        <h3 className="text-xl font-normal text-[#1D1B20] tracking-tight">
          Report Troubleticket
        </h3>
        {initialData && (
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${initialData.status === 'open' ? 'bg-[#E8DEF8] text-[#1D192B] border-[#E8DEF8]' : 'bg-[#FFD8E4] text-[#31111D] border-[#FFD8E4]'}`}
          >
            {initialData.status}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* KOLOM KIRI */}
        <div
          className={`space-y-6 ${initialData ? 'opacity-80 pointer-events-none select-none' : ''}`}
        >
          <div>
            <label className={labelClass}>
              Title {!initialData && <span className="text-[#B3261E]">*</span>}
            </label>
            <div className="relative">
              <select
                {...register('title')}
                disabled={!!initialData}
                className={inputClass(errors.title)}
              >
                <option value="">Pilih Kategori...</option>
                <option value="Genset Fail">Genset Fail to Start</option>
                <option value="Low Fuel">Low Fuel Level</option>
                <option value="High Temp">High Temperature</option>
                <option value="Mains Failure">Mains Failure</option>
                <option value="Lainnya">Lainnya...</option>
              </select>
              {!initialData && (
                <AlertTriangle
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#79747E]"
                />
              )}
            </div>
            {errors.title && (
              <p className={errorClass}>{errors.title.message as string}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Keterangan <span className="text-[#B3261E]">*</span>
            </label>
            <textarea
              {...register('description')}
              placeholder="Tulis keterangan..."
              rows={3}
              className={
                inputClass(errors.description) + ' resize-none text-sm'
              }
            />
            {errors.description && (
              <p className={errorClass}>
                {errors.description.message as string}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Site ID{' '}
              {!initialData && <span className="text-[#B3261E]">*</span>}
            </label>
            <div className="relative">
              <input
                {...register('siteId')}
                placeholder="BDO001"
                disabled={!!initialData}
                className={inputClass(errors.siteId)}
              />
              {!initialData && (
                <MapPin
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                  size={20}
                />
              )}
            </div>
            {errors.siteId && (
              <p className={errorClass}>{errors.siteId.message as string}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Priority</label>
            <div className="relative">
              <select
                {...register('priority')}
                disabled={!!initialData}
                className={inputClass(errors.priority)}
              >
                <option value="Critical">Critical</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
              </select>
              {!initialData && (
                <AlertCircle
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#79747E]"
                  size={20}
                />
              )}
            </div>
            {errors.priority && (
              <p className={errorClass}>{errors.priority.message as string}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Start Time{' '}
              {!initialData && <span className="text-[#B3261E]">*</span>}
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                {...register('startTime')}
                disabled={!!initialData}
                className={inputClass(errors.startTime)}
              />
              {!initialData && (
                <Calendar
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                  size={20}
                />
              )}
            </div>
            {errors.startTime && (
              <p className={errorClass}>{errors.startTime.message as string}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Pelapor Awal{' '}
              {!initialData && <span className="text-[#B3261E]">*</span>}
            </label>
            <ReporterBadges
              list={watchedReporters}
              onRemove={removeReporter}
              readOnly={!!initialData}
            />
            {!initialData && (
              <ReporterInput
                isExternal={isExternalInput}
                onAdd={handleAddReporter}
                onAddExternal={handleAddExternalReporter}
                onCancelExternal={() => setIsExternalInput(false)}
                externalValue={externalName}
                setExternalValue={setExternalName}
                error={errors.reporters?.message as string}
                userList={userList}
              />
            )}
            {errors.reporters && !!initialData && (
              <p className={errorClass}>{errors.reporters.message as string}</p>
            )}
          </div>

          {initialData && (
            <AttachmentSection
              images={watchedMainImages}
              target="main"
              readOnly={true}
              onRemove={removeImage}
              onUpload={handleFileSelect}
            />
          )}

          {initialData && renderTechnicalFields(true)}
        </div>

        {/* KOLOM KANAN */}
        <div className="space-y-6">
          {!initialData && renderTechnicalFields(false)}

          {!initialData && (
            <>
              <AttachmentSection
                images={watchedMainImages}
                target="main"
                onRemove={removeImage}
                onUpload={handleFileSelect}
              />
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-2 py-3 px-8 rounded-full font-medium text-sm tracking-wide shadow-sm hover:shadow-md transition-all active:scale-[0.98] ${isLoading ? 'bg-[#E7E0EC] text-[#1D192B] cursor-not-allowed' : 'bg-[#6750A4] text-white hover:bg-[#6750A4]/90'}`}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={18} /> Kirim Laporan
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {initialData && (
            <div className="bg-[#F3EDF7] p-6 rounded-[24px] space-y-6 animate-in slide-in-from-right-2 fade-in shadow-none border border-transparent">
              <div className="flex items-center gap-3 text-[#6750A4] pb-2 border-b border-[#E7E0EC]">
                <History size={24} />
                <h3 className="text-base font-medium tracking-wide">
                  Update Progress Baru
                </h3>
              </div>

              <div>
                <label className={labelClass}>
                  Update Status <span className="text-[#B3261E]">*</span>
                </label>
                <select
                  {...register('status')}
                  className={inputClass(errors.status)}
                >
                  <option value="process">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                {errors.status && (
                  <p className={errorClass}>
                    {errors.status.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Teknisi / Pelapor Update{' '}
                  <span className="text-[#B3261E]">*</span>
                </label>
                <ReporterBadges
                  list={watchedUpdateReporters}
                  onRemove={removeUpdateReporter}
                />
                <ReporterInput
                  isExternal={isUpdateExternalInput}
                  onAdd={handleAddUpdateReporter}
                  onAddExternal={handleAddUpdateExternalReporter}
                  onCancelExternal={() => setIsUpdateExternalInput(false)}
                  externalValue={updateExternalName}
                  setExternalValue={setUpdateExternalName}
                  error={errors.updateReporters?.message as string}
                  userList={userList}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Catatan Pengerjaan <span className="text-[#B3261E]">*</span>
                </label>
                <textarea
                  {...register('updateDescription')}
                  placeholder="Deskripsikan progress..."
                  rows={3}
                  className={
                    inputClass(errors.updateDescription) +
                    ' resize-none text-sm'
                  }
                />
                {errors.updateDescription && (
                  <p className={errorClass}>
                    {errors.updateDescription.message as string}
                  </p>
                )}
              </div>

              <AttachmentSection
                images={watchedUpdateImages}
                target="update"
                onRemove={removeImage}
                onUpload={handleFileSelect}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-8 rounded-full font-medium text-sm tracking-wide shadow-sm hover:shadow-md transition-all active:scale-[0.98] ${isLoading ? 'bg-[#E7E0EC] text-[#1D192B] cursor-not-allowed' : 'bg-[#6750A4] text-white hover:bg-[#6750A4]/90'}`}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Save size={18} /> Simpan & Update
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
