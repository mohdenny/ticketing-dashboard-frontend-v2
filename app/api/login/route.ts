import { NextResponse } from 'next/server';
import { authSchema } from '@/schemas/authSchema';
import { MOCK_USERS } from '@/lib/mockData'; // <--- IMPORT DARI SINI

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const result = authSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: 'Data invalid' }, { status: 400 });
    }

    const { email, password } = result.data;

    // Cari di MOCK_USERS yang sudah centralized
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      const response = NextResponse.json({
        success: true,
        user: {
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
        },
      });

      // ... (Sisa kode cookie sama persis seperti sebelumnya) ...
      response.cookies.set(
        'auth',
        JSON.stringify({
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
        }),
        { httpOnly: true, path: '/' },
      );

      return response;
    }

    return NextResponse.json({ message: 'Gagal Login' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'Error Server' }, { status: 500 });
  }
};
