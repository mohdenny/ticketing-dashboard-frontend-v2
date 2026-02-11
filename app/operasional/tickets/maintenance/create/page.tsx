'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import MaintenanceForm from '@/components/modules/tickets/maintenance/MaintenanceForm';
import { useMaintenance } from '@/hooks/useMaintenance';
import { MaintenanceFormValues } from '@/schemas/maintenanceSchema';
import { CancelAction } from '@/components/layouts/CancelAction'; // Asumsi Anda punya komponen ini

export default function CreateMaintenancePage() {
  const router = useRouter();
  const { createMaintenance, isProcessing } = useMaintenance();

  const handleCreateSubmit = async (data: MaintenanceFormValues) => {
    try {
      await createMaintenance(data);
      toast.success('Tiket Maintenance berhasil dijadwalkan!');
      // Redirect ke halaman list tiket setelah sukses
      router.push('/operasional/tickets/trouble');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Gagal membuat tiket, silakan coba lagi.');
    }
  };

  return (
    <div className="max-w-2xl lg:max-w-full mx-auto p-6">
      {/* Header Halaman */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1B20] tracking-tight">
            Maintenance Baru
          </h1>
          <p className="text-gray-500 mt-1">
            Buat jadwal dan laporan maintenance jaringan preventif.
          </p>
        </div>
        <CancelAction
          link="/operasional/tickets/trouble"
          label="Batal & Kembali"
        />
      </div>

      {/* Container Form */}
      <div className="bg-white p-8 rounded-[32px] border border-[#E6E0E9] shadow-sm">
        <MaintenanceForm
          onSubmit={handleCreateSubmit}
          isLoading={isProcessing}
          onClose={() => router.push('/operasional/tickets/trouble')}
        />
      </div>
    </div>
  );
}
