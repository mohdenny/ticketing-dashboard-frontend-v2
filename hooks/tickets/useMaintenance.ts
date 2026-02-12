'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaintenanceFormValues } from '@/schemas/tickets/maintenance';
import { MaintenanceTicket } from '@/types/tickets/maintenance';

export const useMaintenance = () => {
  const queryClient = useQueryClient();

  const {
    data: maintenanceTickets = [],
    isLoading,
    error,
  } = useQuery<MaintenanceTicket[]>({
    queryKey: ['tickets-maintenance'],
    queryFn: async () => {
      const res = await fetch('/api/tickets/maintenance');
      if (!res.ok) throw new Error('Gagal memuat data');
      return res.json();
    },
  });

  const { mutateAsync: createMaintenance, isPending: isCreating } = useMutation(
    {
      mutationFn: async (data: MaintenanceFormValues) => {
        const res = await fetch('/api/tickets/maintenance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Gagal create');
        return res.json();
      },
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['tickets-maintenance'] }),
    },
  );

  const { mutateAsync: updateMaintenance, isPending: isUpdating } = useMutation(
    {
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: MaintenanceTicket;
      }) => {
        const res = await fetch(`/api/tickets/maintenance?id=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Gagal update');
        return res.json();
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['tickets-maintenance'] });
        queryClient.invalidateQueries({
          queryKey: ['maintenance-detail', variables.id],
        });
      },
    },
  );

  const { mutateAsync: deleteMaintenance, isPending: isDeleting } = useMutation(
    {
      mutationFn: async (id: string) => {
        const res = await fetch(`/api/tickets/maintenance?id=${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Gagal delete');
        return res.json();
      },
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['tickets-maintenance'] }),
    },
  );

  return {
    maintenanceTickets,
    isLoading,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    isProcessing: isCreating || isUpdating || isDeleting,
  };
};

export const useMaintenanceDetail = (id: string | null) => {
  return useQuery<MaintenanceTicket>({
    queryKey: ['maintenance-detail', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/tickets/maintenance?id=${id}`);
      if (!res.ok) throw new Error('Not found');
      return res.json();
    },
    enabled: !!id,
  });
};
