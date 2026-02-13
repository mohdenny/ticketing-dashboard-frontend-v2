import {
  Save,
  Send,
  Loader2,
  Image as ImageIcon,
  X,
  User,
  Users,
  CheckCircle2,
  Zap,
  Calendar,
  ClipboardList,
  Hammer,
  AlertTriangle,
  Clock,
  Signal,
  Activity,
  History,
} from 'lucide-react';

interface TicketMaintenanceFormUIProps {
  mode?: 'create' | 'edit'; // Prop untuk mengatur tampilan UI
  isLoading?: boolean;
}

export default function MaintenanceForm({
  mode = 'create', // Default ke tampilan create
  isLoading = false,
}: TicketMaintenanceFormUIProps) {
  // Style utils ---
  const inputClass = `w-full px-4 py-3 rounded-[12px] border border-[#79747E] bg-white text-[#1D1B20] outline-none transition-all placeholder:text-[#49454F]/50 appearance-none hover:border-[#49454F] focus:border-[#6750A4] focus:ring-1 focus:ring-[#6750A4]`;

  const labelClass =
    'text-sm font-medium text-[#49454F] mb-2 block tracking-wide';

  const AttachmentSectionUI = ({
    label = 'Dokumentasi',
    showPreview = false,
  }: {
    label?: string;
    showPreview?: boolean;
  }) => (
    <div className="space-y-2">
      <label className={labelClass}>
        {label}
        <span className="text-xs text-[#79747E] ml-2 font-normal">(0/5)</span>
      </label>

      {/* Mockup jika ada gambar (Preview) */}
      {showPreview && (
        <div className="grid grid-cols-3 gap-3 mb-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="relative aspect-square rounded-[12px] overflow-hidden border border-[#CAC4D0] group bg-white"
            >
              <img
                src={`https://placehold.co/100`}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-[#B3261E] hover:bg-[#F2B8B5] transition-colors shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Placeholder */}
      <label className="flex flex-col items-center justify-center w-full h-[100px] border border-dashed border-[#79747E] rounded-[12px] cursor-pointer hover:bg-[#F3EDF7] transition-all bg-[#F3EDF7]/30">
        <div className="flex flex-col items-center justify-center py-2 text-[#6750A4]">
          <ImageIcon size={24} className="mb-1" />
          <p className="text-xs font-medium">Upload Foto</p>
        </div>
      </label>
    </div>
  );

  const ReporterBadgesUI = ({ isEmpty = false }) => (
    <div className="flex flex-wrap gap-2 mb-3">
      {!isEmpty ? (
        <>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm font-medium border bg-[#E8DEF8] text-[#1D192B] border-[#E8DEF8]">
            <User size={14} /> Teknisi A
            <button
              type="button"
              className="text-[#1D192B] hover:text-[#B3261E] transition-colors rounded-full p-0.5"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm font-medium border bg-[#E8DEF8] text-[#1D192B] border-[#E8DEF8]">
            <User size={14} /> Teknisi B
            <button
              type="button"
              className="text-[#1D192B] hover:text-[#B3261E] transition-colors rounded-full p-0.5"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </span>
        </>
      ) : (
        <span className="text-sm text-[#79747E] italic py-1">
          - Belum ada petugas -
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-[#CAC4D0] flex justify-between items-center">
        <h3 className="text-xl font-normal text-[#1D1B20] tracking-tight">
          Laporan Maintenance
        </h3>
        {mode === 'edit' && (
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm bg-[#E8DEF8] text-[#1D192B] border-[#E8DEF8]">
            Process
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* Kolom kiri data utama */}
        <div
          className={`space-y-6 ${mode === 'edit' ? 'opacity-80 pointer-events-none select-none grayscale-[0.5]' : ''}`}
        >
          {/* Title */}
          <div>
            <label className={labelClass}>
              Title / Judul Kegiatan <span className="text-[#B3261E]">*</span>
            </label>
            <div className="relative">
              <input
                disabled={mode === 'edit'}
                placeholder="Contoh: PM Genset Site X"
                className={inputClass}
              />
              {mode === 'create' && (
                <ClipboardList
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                  size={20}
                />
              )}
            </div>
          </div>

          {/* Trouble Source */}
          <div>
            <label className={labelClass}>
              Trouble Source <span className="text-[#B3261E]">*</span>
            </label>
            <div className="relative">
              <select disabled={mode === 'edit'} className={inputClass}>
                <option value="">-- Pilih --</option>
                <option value="Cuaca">Cuaca</option>
                <option value="Genset">Genset</option>
                <option value="Internet">Internet</option>
              </select>
              {mode === 'create' && (
                <AlertTriangle
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                  size={20}
                />
              )}
            </div>
          </div>

          {/* Start Time */}
          <div>
            <label className={labelClass}>
              Start Time / Waktu Mulai <span className="text-[#B3261E]">*</span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                disabled={mode === 'edit'}
                className={inputClass}
              />
              {mode === 'create' && (
                <Calendar
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                  size={20}
                />
              )}
            </div>
          </div>

          {/* PIC / Reporters */}
          <div>
            <label className={labelClass}>
              PIC / Petugas <span className="text-[#B3261E]">*</span>
            </label>
            <ReporterBadgesUI isEmpty={mode === 'create'} />

            {mode === 'create' && (
              <div className="relative group space-y-1">
                <select className={inputClass} defaultValue="">
                  <option value="" disabled>
                    + Tambah Petugas...
                  </option>
                  <option value="1">Teknisi A</option>
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
            )}
          </div>

          {/* Attachment Readonly in Edit Mode */}
          {mode === 'edit' && (
            <AttachmentSectionUI label="Dokumentasi Awal" showPreview={true} />
          )}
        </div>

        {/* Kolom kanan detail dan update */}
        <div className="space-y-6">
          {/* Detail Teknis Fields (Readonly jika Edit Mode) */}
          <div
            className={`${mode === 'edit' ? 'opacity-80 pointer-events-none select-none grayscale-[0.5]' : ''} space-y-6`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Network Element</label>
                <div className="relative">
                  <input
                    disabled={mode === 'edit'}
                    className={inputClass}
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
                    disabled={mode === 'edit'}
                    className={inputClass}
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
                    disabled={mode === 'edit'}
                    className={inputClass}
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
                    disabled={mode === 'edit'}
                    className={inputClass}
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
                disabled={mode === 'edit'}
                className={inputClass}
                placeholder="Penyebab Indikasi..."
              />
            </div>

            <div>
              <label className={labelClass}>Broadcast Explanation</label>
              <textarea
                disabled={mode === 'edit'}
                rows={3}
                className={inputClass + ' resize-none'}
                placeholder="Penjelasan detail..."
              />
            </div>
          </div>

          {/* Mode create */}
          {mode === 'create' && (
            <>
              <AttachmentSectionUI />
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-6 rounded-full font-medium text-sm tracking-wide bg-transparent border border-[#79747E] text-[#1D1B20] hover:bg-[#F3EDF7] transition-all"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-2 py-3 px-8 rounded-full font-medium text-sm tracking-wide shadow-sm hover:shadow-md transition-all active:scale-[0.98] ${isLoading ? 'bg-[#E7E0EC] text-[#1D192B]' : 'bg-[#6750A4] text-white hover:bg-[#6750A4]/90'}`}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={18} /> Submit Maintenance
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Mode edit */}
          {mode === 'edit' && (
            <>
              <div className="bg-[#F3EDF7] p-6 rounded-[24px] space-y-6 shadow-none border border-transparent">
                <div className="flex items-center gap-3 text-[#6750A4] pb-2 border-b border-[#E7E0EC]">
                  <Hammer size={24} />
                  <h3 className="text-base font-medium tracking-wide">
                    Update Pengerjaan
                  </h3>
                </div>

                {/* Status Field */}
                <div>
                  <label className={labelClass}>
                    Status Akhir <span className="text-[#B3261E]">*</span>
                  </label>
                  <select className={inputClass}>
                    <option value="process">
                      Sedang Dikerjakan (In Progress)
                    </option>
                    <option value="closed">Selesai (Done)</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                {/* Teknisi Update */}
                <div>
                  <label className={labelClass}>
                    Teknisi Lapangan <span className="text-[#B3261E]">*</span>
                  </label>
                  <ReporterBadgesUI isEmpty={true} />
                  <div className="relative group space-y-1">
                    <select className={inputClass} defaultValue="">
                      <option value="" disabled>
                        + Tambah Teknisi...
                      </option>
                      <option value="1">Teknisi A</option>
                    </select>
                    <Users
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#79747E] pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className={labelClass}>
                    Laporan Hasil Pengerjaan{' '}
                    <span className="text-[#B3261E]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Deskripsikan apa saja yang sudah dikerjakan..."
                    className={inputClass + ' resize-none text-sm'}
                  />
                </div>

                {/* Foto Update */}
                <AttachmentSectionUI label="Foto Pengerjaan" />

                {/* Buttons */}
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    className="flex-1 md:flex-none flex items-center justify-center py-3 px-6 rounded-full font-medium text-sm tracking-wide bg-white border border-[#79747E] text-[#1D1B20] hover:bg-[#E7E0EC] transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 py-3 px-8 rounded-full font-medium text-sm tracking-wide shadow-sm bg-[#6750A4] text-white hover:bg-[#6750A4]/90"
                  >
                    <Save size={18} /> Update Laporan
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
