// app/api/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Tambahkan 'await' sebelum cookies() - SUDAH TEPAT untuk Next.js versi terbaru
  const cookieStore = await cookies();

  // BIG TECH NOTE: Gunakan opsi yang sama saat menghapus (terutama path)
  // Ini memastikan cookie benar-benar bersih dari semua path aplikasi
  cookieStore.set('auth', '', {
    path: '/',
    maxAge: 0, // Memaksa browser segera menghapus cookie
    expires: new Date(0),
  });

  // Alternatif singkatnya tetap bisa:
  // cookieStore.delete('auth');

  return NextResponse.json({
    success: true,
    message: 'Logout berhasil',
  });
}
