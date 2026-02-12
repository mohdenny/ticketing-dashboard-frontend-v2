'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PageTitle from '@/components/layouts/PageTitle';
import TicketMaintenanceForm from '@/components/modules/tickets/maintenance/MaintenanceForm';
import { useMaintenance, useMaintenanceDetail } from '@/hooks/tickets';
import { Loader2 } from 'lucide-react';

export default function EditMaintenancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: ticket, isLoading } = useMaintenanceDetail(id);
  const { updateMaintenance, isUpdating } = useMaintenance();

  const handleSubmit = async (formData: any, historyData?: any) => {
    try {
      const payload = {
        ...formData,
        historyNote: historyData?.description,
        historyUser: 'Current User',
        historyImages: historyData?.images,
        status: historyData?.status || formData.status,
      };
      await updateMaintenance({ id, data: payload });
      toast.success('Update berhasil');
      // Refresh page data or redirect
      router.push('/operational/tickets/maintenance');
    } catch (e) {
      toast.error('Gagal update');
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#FDFCFF] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6750A4]" size={40} />
      </div>
    );
  if (!ticket) return <div>Not Found</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFF] p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <PageTitle
          title={`Update #${id}`}
          description="Update status pengerjaan."
          actionButton={{
            link: 'link="/operational/tickets/maintenance',
            label: 'Buat Tiket',
          }}
        />
        <div className="bg-[#FEF7FF] rounded-[24px] p-6 border border-[#CAC4D0]">
          <TicketMaintenanceForm
            initialData={ticket}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            onClose={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}
