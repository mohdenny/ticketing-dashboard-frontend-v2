'use client';

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

  const login = async (email: string, pass: string) => {
    // Mulai loading dan hapus error lama secara otomatis melalui Redux
    dispatch(setLoading());

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (res.ok) {
        // Simpan data ke global state
        dispatch(setUser(data.user));

        // Refresh server components dan arahkan ke dashboard
        router.refresh();
        router.push('/');
        return { success: true };
      } else {
        // Tangkap error dari API (misal: "Password salah")
        const msg = data.message || 'Login gagal, periksa kembali akun Anda';
        dispatch(setError(msg));
        return { success: false, message: msg };
      }
    } catch (error) {
      // Tangkap error infrastruktur (misal: Server mati/Internet putus)
      const msg =
        'Terjadi kesalahan jaringan. Silakan coba beberapa saat lagi.';
      dispatch(setError(msg));
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      // Tetap logout di sisi klien meskipun API logout gagal
      dispatch(logoutAction());
      router.refresh();
      router.push('/login');
    }
  };

  return { login, logout };
};
