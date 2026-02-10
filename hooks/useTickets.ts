'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ticket } from '@/types/ticket';
import { TicketFormValues } from '@/schemas/ticketSchema';

export interface UserOption {
  id: number | string;
  name: string;
  role: 'admin' | 'user';
}

// Payload Update
type UpdateTicketPayload = {
  id: number | string;
  data: Partial<TicketFormValues>;
  history?: {
    description: string;
    user: string;
    images?: string[];
    status: 'open' | 'process' | 'closed';
  };
};

export const useUsers = () => {
  return useQuery<UserOption[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Gagal mengambil data user');
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useTickets = () => {
  const queryClient = useQueryClient();

  const {
    data: tickets = [],
    isLoading,
    error,
  } = useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await fetch('/api/tickets');
      if (!res.ok) throw new Error('Gagal memuat tiket');
      return res.json();
    },
  });

  const { mutateAsync: createTicket, isPending: isCreating } = useMutation({
    mutationFn: async (data: TicketFormValues) => {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal membuat tiket');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const { mutateAsync: updateTicket, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data, history }: UpdateTicketPayload) => {
      // Payload Gabungan
      const payload = {
        ...data, // Ini mengandung 'status' dari form (PENTING)
        ...(history && {
          description: history.description,
          user: history.user,
          images: history.images, // Images khusus update
          status: history.status, // Redundan untuk safety
        }),
      };

      const res = await fetch(`/api/tickets?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal update tiket');
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({
        queryKey: ['ticket', String(variables.id)],
      });
    },
  });

  const { mutateAsync: deleteTicket, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number | string) => {
      const res = await fetch(`/api/tickets?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus tiket');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  return {
    tickets,
    isLoading,
    isError: !!error,
    createTicket,
    updateTicket,
    deleteTicket,
    isProcessing: isCreating || isUpdating || isDeleting,
  };
};

export const useTicketDetail = (id: number | string | null) => {
  return useQuery<Ticket>({
    queryKey: ['ticket', String(id)],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/tickets?id=${id}`);
      if (!res.ok) throw new Error('Tiket tidak ditemukan');
      return res.json();
    },
    enabled: !!id,
  });
};
