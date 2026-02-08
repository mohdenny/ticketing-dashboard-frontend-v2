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

  // 3. PUT (Update) - DISESUAIKAN KE QUERY PARAMS (?id=)
  const { mutateAsync: updateTicket, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: TicketFormValues;
    }) => {
      const res = await fetch(`/api/tickets?id=${id}`, {
        // Pakai ?id=
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

  // 4. DELETE - DISESUAIKAN KE QUERY PARAMS (?id=)
  const { mutateAsync: deleteTicket, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number | string) => {
      const res = await fetch(`/api/tickets/${id}`, { method: 'DELETE' }); // Pakai ?id=
      if (!res.ok) throw new Error('Gagal menghapus');
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

// Hook Detail - DISESUAIKAN
export const useTicketDetail = (id: number | string | null) => {
  return useQuery<Ticket>({
    queryKey: ['ticket', String(id)],
    queryFn: async () => {
      const res = await fetch(`/api/tickets/${id}`); // Pakai ?id=
      if (!res.ok) throw new Error('Tiket tidak ditemukan');
      return res.json();
    },
    enabled: !!id,
  });
};
