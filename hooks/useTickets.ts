'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TicketTrouble } from '@/types/ticketTrouble';
import { TicketTroubleFormValues } from '@/schemas/ticketTroubleSchema';

export interface UserOption {
  id: number | string;
  name: string;
  role: 'admin' | 'user';
}

type UpdateTicketPayload = {
  id: number | string;
  data: Partial<TicketTroubleFormValues>;
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

  // GET ALL
  const {
    data: tickets = [],
    isLoading,
    error,
  } = useQuery<TicketTrouble[]>({
    queryKey: ['tickets-trouble'],
    queryFn: async () => {
      const res = await fetch('/api/tickets/trouble');
      if (!res.ok) throw new Error('Gagal memuat tiket');
      return res.json();
    },
  });

  // POST
  const { mutateAsync: createTicket, isPending: isCreating } = useMutation({
    mutationFn: async (data: TicketTroubleFormValues) => {
      const res = await fetch('/api/tickets/trouble', {
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
      queryClient.invalidateQueries({ queryKey: ['tickets-trouble'] });
    },
  });

  // PUT (UPDATE - FIX DISINI)
  const { mutateAsync: updateTicket, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data, history }: UpdateTicketPayload) => {
      // [FIX] Pisahkan historyImages agar tidak menimpa images utama
      const payload = {
        ...data, // Ini berisi 'images' (FOTO UTAMA)

        // Mapping data history secara manual dengan nama key yang unik
        ...(history && {
          historyDescription: history.description,
          historyUser: history.user,
          historyStatus: history.status,
          historyImages: history.images, // [PENTING] Kirim sebagai 'historyImages'
        }),
      };

      const res = await fetch(`/api/tickets/trouble?id=${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ['tickets-trouble'] });
      queryClient.invalidateQueries({
        queryKey: ['ticket-trouble', String(variables.id)],
      });
    },
  });

  // DELETE
  const { mutateAsync: deleteTicket, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number | string) => {
      const res = await fetch(`/api/tickets/trouble?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus tiket');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets-trouble'] });
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
  return useQuery<TicketTrouble>({
    queryKey: ['ticket-trouble', String(id)],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/tickets/trouble?id=${id}`);
      if (!res.ok) throw new Error('Tiket tidak ditemukan');
      return res.json();
    },
    enabled: !!id,
  });
};
