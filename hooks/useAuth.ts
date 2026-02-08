'use client';

import { useAppDispatch } from '@/store/hooks';
import { setUser, logout as logoutAction } from '@/store/user/userSlice';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        // Set ke Redux
        dispatch(setUser(data.user));
        // Pindah halaman
        router.push('/');
        return { success: true };
      } else {
        return { success: false, message: 'Login gagal' };
      }
    } catch (error) {
      return { success: false, message: 'Terjadi kesalahan jaringan' };
    }
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    dispatch(logoutAction());
    router.push('/login');
    router.refresh();
  };

  return { login, logout };
};
