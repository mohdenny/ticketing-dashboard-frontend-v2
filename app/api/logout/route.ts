import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();

  // Pastikan cookie bersih dari semua path aplikasi
  cookieStore.set('auth', '', {
    path: '/',
    maxAge: 0, // Paksa browser segera menghapus cookie
    expires: new Date(0),
  });

  return NextResponse.json({
    success: true,
    message: 'Logout berhasil',
  });
}
