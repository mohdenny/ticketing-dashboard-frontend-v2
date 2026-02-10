import { NextResponse } from 'next/server';
import { MOCK_USERS } from '@/lib/mockData';

export async function GET() {
  // Kita map agar password TIDAK ikut terkirim ke frontend
  const safeUsers = MOCK_USERS.map((user) => ({
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  }));

  return NextResponse.json(safeUsers);
}
