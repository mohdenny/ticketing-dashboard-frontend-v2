'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trouble, UserOption } from '@/types/tickets/trouble';
import { TroubleFormValues } from '@/schemas/tickets/trouble';

// Fetch Users (Helper)
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

export const useTrouble = () => {
  const queryClient = useQueryClient();

  // GET ALL
  const {
    data: tickets = [],
    isLoading,
    error,
  } = useQuery<Trouble[]>({
    queryKey: ['tickets-trouble'],
    queryFn: async () => {
      const res = await fetch('/api/tickets/trouble');
      if (!res.ok) throw new Error('Gagal memuat tiket');
      return res.json();
    },
  });

  // POST (Create)
  const { mutateAsync: createTicket, isPending: isCreating } = useMutation({
    mutationFn: async (data: TroubleFormValues) => {
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

  // PUT (Update)
  const { mutateAsync: updateTicket, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string | number;
      data: TroubleFormValues;
    }) => {
      const res = await fetch(`/api/tickets/trouble?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // Kirim langsung karena Zod Schema sudah match dengan API
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

export const useTroubleDetail = (id: number | string | null) => {
  return useQuery<Trouble>({
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
