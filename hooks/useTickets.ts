'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TicketFormValues } from '@/schemas/ticketSchema';
import { Ticket } from '@/types/ticket';

export const useTickets = () => {
  const queryClient = useQueryClient();

  // 1. GET ALL
  const { data: tickets = [], isLoading } = useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await fetch('/api/tickets');
      if (!res.ok) throw new Error('Gagal memuat tiket');
      return res.json();
    },
  });

  // 2. POST (Tambah)
  const { mutateAsync: createTicket, isPending: isCreating } = useMutation({
    mutationFn: async (data: TicketFormValues) => {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });

  // 3. PUT (Update) - SINKRON KE ?id=
  const { mutateAsync: updateTicket, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: TicketFormValues;
    }) => {
      // PERBAIKAN: Gunakan ?id= agar terbaca searchParams.get('id') di API
      const res = await fetch(`/api/tickets?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal update');
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });

  // 4. DELETE - SINKRON KE ?id=
  const { mutateAsync: deleteTicket, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number | string) => {
      // PERBAIKAN: Sebelumnya /api/tickets/${id}, diubah ke ?id=
      const res = await fetch(`/api/tickets?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tickets'] }),
  });

  return {
    tickets,
    isLoading,
    createTicket,
    updateTicket,
    deleteTicket,
    isProcessing: isCreating || isUpdating || isDeleting,
  };
};

// Hook Detail - SINKRON KE ?id=
export const useTicketDetail = (id: number | string | null) => {
  return useQuery<Ticket>({
    queryKey: ['ticket', String(id)],
    queryFn: async () => {
      // PERBAIKAN: Sebelumnya /api/tickets/${id}, diubah ke ?id=
      const res = await fetch(`/api/tickets?id=${id}`);
      if (!res.ok) throw new Error('Tiket tidak ditemukan');
      return res.json();
    },
    enabled: !!id,
  });
};
