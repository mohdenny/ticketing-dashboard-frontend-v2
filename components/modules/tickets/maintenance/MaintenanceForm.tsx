'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  maintenanceSchema,
  MaintenanceFormValues,
} from '@/schemas/maintenanceSchema';
import {
  Save,
  Send,
  Loader2,
  Image as ImageIcon,
  X,
  User,
  Users,
  CheckCircle2,
  MapPin,
  Zap,
  Calendar,
  ClipboardList,
  Hammer,
  AlertTriangle,
  Info,
  Clock,
  Signal,
  Activity,
  History, // Ikon untuk Timeline
  FileText,
} from 'lucide-react';
import { useState, ChangeEvent, useEffect } from 'react';
import { useUsers } from '@/hooks/useTickets';

// --- TYPES ---
interface HistoryData {
  description: string;
  user: string;
  reporters?: string[];
  images?: string[];
  status: 'open' | 'process' | 'closed';
}

// Asumsi tipe data update/history dari backend
interface TicketUpdateLog {
  id: string;
  date: string;
  user: string;
  status: string;
  description?: string;
  images?: string[];
}

interface TicketMaintenanceFormProps {
  initialData?: any; // initialData diasumsikan memiliki properti 'updates' (array of log)
  onSubmit: (data: any, history?: HistoryData) => void;
  isLoading?: boolean;
  onClose?: () => void;
}

export default function TicketMaintenanceForm({
  initialData,
  onSubmit,
  isLoading,
  onClose,
}: TicketMaintenanceFormProps) {
  const { data: userList } = useUsers();

  // --- STATE ---
  const [mainImages, setMainImages] = useState<string[]>(
    initialData?.images || [],
  );
  const [updateImages, setUpdateImages] = useState<string[]>([]);

  // State PIC
  const [reporters, setReporters] = useState<string[]>(
    initialData?.pic
      ? [initialData.pic]
      : initialData?.assignedUser
        ? [initialData.assignedUser]
        : [],
  );

  // State Update
  const [updateReporters, setUpdateReporters] = useState<string[]>([]);
  const [isExternalInput, setIsExternalInput] = useState(false);
  const [externalName, setExternalName] = useState('');
  const [isUpdateExternalInput, setIsUpdateExternalInput] = useState(false);
  const [updateExternalName, setUpdateExternalName] = useState('');

  // --- FORM ---
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<MaintenanceFormValues | any>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      title: initialData?.title || '',
      troubleSource: initialData?.troubleSource || '',
      broadcastExplanation: initialData?.broadcastExplanation || '',
      probableCause: initialData?.probableCause || '',
      networkElement: initialData?.networkElement || '',
      statusTx: initialData?.statusTx || '',
      impactTx: initialData?.impactTx || '',
      estimasiDowntime: initialData?.estimasiDowntime || '',
      startTime: initialData?.startTime || '',
      pic: initialData?.pic || '',
      impactCustomer: initialData?.impactCustomer || '',
      images: initialData?.images || [],
      historyNote: '',
      historyReporters: [],
      status: initialData ? initialData.status : 'Scheduled',
    },
  });

  // --- SYNC ---
  useEffect(() => {
    if (reporters.length > 0) {
      setValue('pic', reporters[0]);
      if (errors.pic) trigger('pic');
    } else {
      setValue('pic', '');
    }
  }, [reporters, setValue, trigger, errors.pic]);

  useEffect(() => {
    setValue('historyReporters', updateReporters);
  }, [updateReporters, setValue]);

  // --- HANDLERS (Reporter) ---
  const handleAddReporter = (value: string) => {
    if (value === 'external') {
      setIsExternalInput(true);
      return;
    }
    if (value && !reporters.includes(value))
      setReporters([...reporters, value]);
  };

  const handleAddExternalReporter = () => {
    if (externalName.trim()) {
      const name = `${externalName} (Ext)`;
      if (!reporters.includes(name)) setReporters([...reporters, name]);
      setExternalName('');
      setIsExternalInput(false);
    }
  };

  const removeReporter = (index: number) => {
    setReporters(reporters.filter((_, i) => i !== index));
  };

  const handleAddUpdateReporter = (value: string) => {
    if (value === 'external') {
      setIsUpdateExternalInput(true);
      return;
    }
    if (value && !updateReporters.includes(value))
      setUpdateReporters([...updateReporters, value]);
  };

  const handleAddUpdateExternalReporter = () => {
    if (updateExternalName.trim()) {
      const name = `${updateExternalName} (Ext)`;
      if (!updateReporters.includes(name))
        setUpdateReporters([...updateReporters, name]);
      setUpdateExternalName('');
      setIsUpdateExternalInput(false);
    }
  };

  const removeUpdateReporter = (index: number) => {
    setUpdateReporters(updateReporters.filter((_, i) => i !== index));
  };

  // --- HANDLERS (Files) ---
  const handleFileSelect = (
    e: ChangeEvent<HTMLInputElement>,
    target: 'main' | 'update',
  ) => {
    const files = e.target.files;
    if (!files) return;
    const currentCount =
      target === 'main' ? mainImages.length : updateImages.length;
    if (files.length + currentCount > 5) return alert(`Maksimal 5 foto.`);
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
      if (target === 'main') {
        setMainImages((prev) => [...prev, ...base64Images]);
        setValue('images', [...mainImages, ...base64Images]);
      } else {
        setUpdateImages((prev) => [...prev, ...base64Images]);
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
      setUpdateImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // --- SUBMIT ---
  const onFormSubmit = (data: any) => {
    let historyPayload: HistoryData | undefined;
    if (initialData) {
      historyPayload = {
        description: data.historyNote,
        user: 'Current User',
        reporters: updateReporters,
        images: updateImages,
        status: data.status,
      };
    }
    const finalData = {
      ...data,
      pic: reporters.length > 0 ? reporters[0] : '',
      images: mainImages,
    };
    onSubmit(finalData, historyPayload);
  };

  const onFormError = (errors: any) => {
    console.error('Validation Errors:', errors);
    if (errors.pic) alert('PIC wajib dipilih');
  };

  // --- UTILS ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const inputClass = (error?: any) =>
    `w-full px-4 py-3 rounded-[12px] border text-[#1D1B20] outline-none transition-all placeholder:text-[#49454F]/50 appearance-none
    ${
      error
        ? 'border-[#B3261E] focus:border-[#B3261E] focus:ring-1 focus:ring-[#B3261E] bg-red-50/10'
        : 'border-[#79747E] bg-white hover:border-[#49454F] focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]'
    }`;

  const labelClass =
    'text-sm font-medium text-[#49454F] mb-2 block tracking-wide';
  const errorClass = 'text-xs text-[#B3261E] mt-1 ml-1 font-medium';

  // --- COMPONENTS ---
  const AttachmentSection = ({ images, target, readOnly = false }: any) => (
    <div className="space-y-2">
      <label className={labelClass}>
        {target === 'main' ? 'Dokumentasi' : 'Foto Pengerjaan'}
        <span className="text-xs text-[#79747E] ml-2 font-normal">
          ({images.length}/5)
        </span>
      </label>
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-2">
          {images.map((img: string, idx: number) => (
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
                  onClick={() => removeImage(idx, target)}
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
            onChange={(e) => handleFileSelect(e, target)}
          />
        </label>
      )}
    </div>
  );

  const ReporterBadges = ({ list, onRemove, readOnly }: any) => (
    <div className="flex flex-wrap gap-2 mb-3">
      {list.map((rep: string, idx: number) => (
        <span
          key={idx}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm font-medium border transition-colors ${
            readOnly
              ? 'bg-[#E7E0EC] text-[#49454F] border-[#CAC4D0]'
              : 'bg-[#E8DEF8] text-[#1D192B] border-[#E8DEF8] hover:shadow-sm'
          }`}
        >
          <User size={14} /> {rep}
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
          - Belum ada petugas -
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
  }: any) => (
    <div className="space-y-1">
      {!isExternal ? (
        <div className="relative group">
          <select
            onChange={(e) => onAdd(e.target.value)}
            className={inputClass(error)}
            defaultValue=""
          >
            <option value="" disabled>
              + Tambah Petugas...
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
            size={20}
          />
        </div>
      ) : (
        <div className="flex gap-2 animate-in fade-in zoom-in-95 duration-200">
          <input
            autoFocus
            placeholder="Nama teknisi..."
            value={externalValue}
            onChange={(e: any) => setExternalValue(e.target.value)}
            className={inputClass(error)}
          />
          <button
            type="button"
            onClick={onAddExternal}
            className="bg-[#6750A4] text-white px-4 rounded-[12px]"
          >
            <CheckCircle2 size={24} />
          </button>
          <button
            type="button"
            onClick={onCancelExternal}
            className="bg-[#F3EDF7] text-[#1D1B20] px-3 rounded-[12px]"
          >
            <X size={24} />
          </button>
        </div>
      )}
      {(error || errors.pic) && (
        <p className={errorClass}>{error || (errors.pic?.message as string)}</p>
      )}
    </div>
  );

  // --- NEW: TIMELINE COMPONENT ---
  const TimelineSection = ({ updates }: { updates: TicketUpdateLog[] }) => {
    if (!updates || updates.length === 0) return null;

    return (
      <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-[#E8DEF8] p-2 rounded-full">
            <History size={20} className="text-[#1D192B]" />
          </div>
          <h3 className="text-lg font-bold text-[#1D1B20]">
            Riwayat Aktivitas
          </h3>
        </div>

        <div className="relative border-l-2 border-[#E7E0EC] ml-3.5 space-y-8 pb-2">
          {updates.map((log, index) => (
            <div key={index} className="relative pl-8 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#6750A4] ring-4 ring-[#FEF7FF] group-last:bg-[#79747E]"></div>

              <div className="flex flex-col gap-1.5">
                {/* Header: User & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="font-bold text-[#1D1B20] text-sm">
                    {log.user}
                  </span>
                  <span className="text-xs text-[#49454F] flex items-center gap-1 bg-[#F3EDF7] px-2 py-0.5 rounded-full w-fit">
                    <Clock size={12} />
                    {formatDate(log.date)}
                  </span>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      log.status === 'closed'
                        ? 'bg-[#C4EED0] text-[#0A3818] border-[#0A3818]/10'
                        : log.status === 'process'
                          ? 'bg-[#E8DEF8] text-[#1D192B] border-[#1D192B]/10'
                          : 'bg-[#E6E0E9] text-[#49454F] border-[#49454F]/10'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>

                {/* Description */}
                {log.description && (
                  <div className="bg-white border border-[#CAC4D0] p-3 rounded-[12px] text-sm text-[#49454F] mt-1 shadow-sm">
                    {log.description}
                  </div>
                )}

                {/* Images in Timeline */}
                {log.images && log.images.length > 0 && (
                  <div className="flex gap-2 mt-1 overflow-x-auto pb-1">
                    {log.images.map((img, i) => (
                      <div
                        key={i}
                        className="h-16 w-16 rounded-[8px] overflow-hidden border border-[#E6E0E9] shrink-0"
                      >
                        <img
                          src={img}
                          alt="Evidence"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SubmitButton = () => (
    <button
      type="submit"
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 py-3 px-8 rounded-full font-medium text-sm tracking-wide shadow-sm hover:shadow-md transition-all active:scale-[0.98]
      ${isLoading ? 'bg-[#E7E0EC] text-[#1D192B] cursor-not-allowed' : 'bg-[#6750A4] text-white hover:bg-[#6750A4]/90'}
      ${initialData ? 'w-full' : 'w-full md:w-auto'}
      disabled:bg-[#1D1B20]/10 disabled:text-[#1D1B20]/40 disabled:shadow-none`}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : initialData ? (
        <>
          <Save size={18} /> Update Laporan
        </>
      ) : (
        <>
          <Send size={18} /> Submit Maintenance
        </>
      )}
    </button>
  );

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit, onFormError)}
      className="space-y-8 pb-10"
    >
      <div className="mb-6 pb-4 border-b border-[#CAC4D0] flex justify-between items-center">
        <h3 className="text-xl font-normal text-[#1D1B20] tracking-tight">
          Laporan Maintenance
        </h3>
        {initialData && (
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
              initialData.status === 'open' ||
              initialData.status === 'Scheduled'
                ? 'bg-[#E8DEF8] text-[#1D192B] border-[#E8DEF8]'
                : 'bg-[#C4EED0] text-[#0A3818] border-[#C4EED0]'
            }`}
          >
            {initialData.status}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* === KOLOM KIRI === */}
        <div
          className={`space-y-6 ${initialData ? 'opacity-80 pointer-events-none select-none' : ''}`}
        >
          {/* Form Fields (Title, Source, Start Time, PIC) - Sama seperti sebelumnya */}
          <div>
            <label className={labelClass}>
              Title / Judul Kegiatan <span className="text-[#B3261E]">*</span>
            </label>
            <div className="relative">
              <input
                {...register('title')}
                disabled={!!initialData}
                placeholder="Contoh: PM Genset Site X"
                className={inputClass(errors.title)}
              />
              {!initialData && (
                <ClipboardList
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                  size={20}
                />
              )}
            </div>
            {errors.title && (
              <p className={errorClass}>{errors.title.message as string}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Trouble Source <span className="text-[#B3261E]">*</span>
            </label>
            <div className="relative">
              <select
                {...register('troubleSource')}
                disabled={!!initialData}
                className={inputClass(errors.troubleSource)}
              >
                <option value="">-- Pilih --</option>
                <option value="Internal">Internal (Perangkat/Power)</option>
                <option value="External">External (PLN/Force Majeure)</option>
                <option value="Material">Material/Sparepart</option>
              </select>
              {!initialData && (
                <AlertTriangle
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                  size={20}
                />
              )}
            </div>
            {errors.troubleSource && (
              <p className={errorClass}>
                {errors.troubleSource.message as string}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Start Time / Waktu Mulai <span className="text-[#B3261E]">*</span>
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
              PIC / Petugas <span className="text-[#B3261E]">*</span>
            </label>
            <ReporterBadges
              list={reporters}
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
                error={errors.pic?.message}
              />
            )}
          </div>

          {initialData && (
            <AttachmentSection
              images={mainImages}
              target="main"
              readOnly={true}
            />
          )}
        </div>

        {/* === KOLOM KANAN === */}
        <div className="space-y-6">
          {/* Detail Teknis Fields */}
          <div
            className={`${initialData ? 'opacity-80 pointer-events-none select-none' : ''} space-y-6`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Network Element</label>
                <div className="relative">
                  <input
                    {...register('networkElement')}
                    disabled={!!initialData}
                    className={inputClass(errors.networkElement)}
                    placeholder="Ex: Rectifier"
                  />
                  <Zap
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Status TX</label>
                <div className="relative">
                  <input
                    {...register('statusTx')}
                    disabled={!!initialData}
                    className={inputClass(errors.statusTx)}
                    placeholder="On Air / Off"
                  />
                  <Signal
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Impact TX</label>
                <div className="relative">
                  <input
                    {...register('impactTx')}
                    disabled={!!initialData}
                    className={inputClass(errors.impactTx)}
                    placeholder="Ex: Degraded"
                  />
                  <Activity
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Est. Downtime</label>
                <div className="relative">
                  <input
                    {...register('estimasiDowntime')}
                    disabled={!!initialData}
                    className={inputClass(errors.estimasiDowntime)}
                    placeholder="Ex: 2 Jam"
                  />
                  <Clock
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Probable Cause</label>
              <input
                {...register('probableCause')}
                disabled={!!initialData}
                className={inputClass(errors.probableCause)}
                placeholder="Penyebab Indikasi..."
              />
            </div>
            <div>
              <label className={labelClass}>Broadcast Explanation</label>
              <textarea
                {...register('broadcastExplanation')}
                disabled={!!initialData}
                rows={3}
                className={
                  inputClass(errors.broadcastExplanation) + ' resize-none'
                }
                placeholder="Penjelasan detail..."
              />
            </div>
          </div>

          {/* Create Mode Actions */}
          {!initialData && (
            <>
              <AttachmentSection images={mainImages} target="main" />
              <div className="pt-4 flex justify-end gap-3">
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 py-3 px-6 rounded-full font-medium text-sm tracking-wide bg-transparent border border-[#79747E] text-[#1D1B20] hover:bg-[#F3EDF7] transition-all"
                  >
                    Batal
                  </button>
                )}
                <SubmitButton />
              </div>
            </>
          )}

          {/* Edit Mode Actions & Timeline */}
          {initialData && (
            <>
              {/* Box Update Pengerjaan */}
              <div className="bg-[#F3EDF7] p-6 rounded-[24px] space-y-6 animate-in slide-in-from-right-2 fade-in shadow-none border border-transparent">
                <div className="flex items-center gap-3 text-[#6750A4] pb-2 border-b border-[#E7E0EC]">
                  <Hammer size={24} />
                  <h3 className="text-base font-medium tracking-wide">
                    Update Pengerjaan
                  </h3>
                </div>
                <div>
                  <label className={labelClass}>
                    Status Akhir <span className="text-[#B3261E]">*</span>
                  </label>
                  <select
                    {...register('status')}
                    className={inputClass(errors.status)}
                  >
                    <option value="process">
                      Sedang Dikerjakan (In Progress)
                    </option>
                    <option value="closed">Selesai (Done)</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Teknisi Lapangan <span className="text-[#B3261E]">*</span>
                  </label>
                  <ReporterBadges
                    list={updateReporters}
                    onRemove={removeUpdateReporter}
                  />
                  <ReporterInput
                    isExternal={isUpdateExternalInput}
                    onAdd={handleAddUpdateReporter}
                    onAddExternal={handleAddUpdateExternalReporter}
                    onCancelExternal={() => setIsUpdateExternalInput(false)}
                    externalValue={updateExternalName}
                    setExternalValue={setUpdateExternalName}
                    error={errors.historyReporters?.message}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Laporan Hasil Pengerjaan{' '}
                    <span className="text-[#B3261E]">*</span>
                  </label>
                  <textarea
                    {...register('historyNote')}
                    rows={3}
                    placeholder="Deskripsikan apa saja yang sudah dikerjakan/diganti..."
                    className={
                      inputClass(errors.historyNote) + ' resize-none text-sm'
                    }
                  />
                  {errors.historyNote && (
                    <p className={errorClass}>
                      {errors.historyNote.message as string}
                    </p>
                  )}
                </div>
                <AttachmentSection images={updateImages} target="update" />
                <div className="pt-2 flex justify-end gap-3">
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 md:flex-none flex items-center justify-center py-3 px-6 rounded-full font-medium text-sm tracking-wide bg-white border border-[#79747E] text-[#1D1B20] hover:bg-[#E7E0EC] transition-all"
                    >
                      Batal
                    </button>
                  )}
                  <div className="flex-1 md:flex-none">
                    <SubmitButton />
                  </div>
                </div>
              </div>

              {/* TIMELINE SECTION (NEW) */}
              <TimelineSection updates={initialData.updates || []} />
            </>
          )}
        </div>
      </div>
    </form>
  );
}
