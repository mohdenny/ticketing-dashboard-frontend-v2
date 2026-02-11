'use client';

import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import {
  setUser,
  logout as logoutAction,
  setLoading,
  setError,
} from '@/store/user/userSlice';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // --- 1. LOGIN MUTATION ---
  const { mutateAsync: loginMutation, isPending: isLoggingIn } = useMutation({
    mutationFn: async ({ email, pass }: { email: string; pass: string }) => {
      // Dispatch loading ke Redux sebelum request (Optional, karena React Query punya state loading sendiri)
      dispatch(setLoading());

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || 'Login gagal, periksa kembali akun Anda',
        );
      }

      return data;
    },
    onSuccess: (data) => {
      // Sukses: Simpan ke Redux & Redirect
      dispatch(setUser(data.user));
      router.refresh();
      router.push('/');
    },
    onError: (error: Error) => {
      // Gagal: Simpan pesan error ke Redux
      dispatch(setError(error.message));
    },
  });

  // --- 2. LOGOUT MUTATION ---
  const { mutateAsync: logoutMutation, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await fetch('/api/logout', { method: 'POST' });
    },
    onSettled: () => {
      // onSettled jalan baik sukses maupun gagal (Cleanup)
      dispatch(logoutAction());
      router.refresh();
      router.push('/login');
    },
  });

  // --- Wrapper Functions untuk maintain signature lama ---
  const login = async (email: string, pass: string) => {
    try {
      await loginMutation({ email, pass });
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    await logoutMutation();
  };

  return {
    login,
    logout,
    isLoading: isLoggingIn || isLoggingOut, // Combined loading state
  };
};
