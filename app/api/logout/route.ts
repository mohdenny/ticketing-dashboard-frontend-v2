// app/api/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Tambahkan 'await' sebelum cookies()
  const cookieStore = await cookies();

  // Sekarang .delete() akan tersedia
  cookieStore.delete('auth');

  return NextResponse.json({ success: true });
}
