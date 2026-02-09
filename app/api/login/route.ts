import { NextResponse } from 'next/server';
import { authSchema } from '@/schemas/authSchema';

export const POST = async (request: Request) => {
  try {
    // Ambil dan mengubah data mentah dari body request menjadi objek JSON (email & password)
    const body = await request.json();

    // Server-side validation. Cek data dari client.
    const result = authSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Format data tidak valid', errors: result.error.format() },
        { status: 400 },
      );
    }

    const { email, password } = result.data;

    // Mock db
    const users = [
      {
        email: 'admin@mail.com',
        name: 'admin',
        password: '123456',
        role: 'admin',
      },
      {
        email: 'denny@mail.com',
        name: 'denny',
        password: '123456',
        role: 'user',
      },
    ];

    // Cari user berdasarkan input email dan password
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    // Validasi kredensia
    // Jika benar, buat objek response JSON dengan status success: true
    // Tempel data user supaya Redux di client bisa langsung dapat email & role
    if (foundUser) {
      const response = NextResponse.json({
        success: true,
        user: {
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
        },
      });

      // Tempel cookie 'auth' ke dalam browser user sebagai penanda sudah login
      response.cookies.set(
        'auth',
        JSON.stringify({
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
        }),
        {
          // Cegah akses via JS (XSS)
          httpOnly: true,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          // Proteksi CSRF standar
          sameSite: 'lax',
          // MaxAge supaya session tidak hilang saat browser ditutup (persistent)
          maxAge: 60 * 60 * 24 * 7, // 7 Hari
        },
      );

      // Kalau backend kirim token di 'body.token'
      // body.token harus berisi payload { email, role } yang di-sign oleh backend
      // response.cookies.set(
      //   'auth',
      //   body.token, // Nanti simpan token JWT-nya disini, bukan JSON string biasa
      //   {
      //     httpOnly: true,
      //     path: '/',
      //     secure: process.env.NODE_ENV === 'production',
      //     sameSite: 'lax',
      //     maxAge: 60 * 60 * 24 * 7,
      //   },
      // );

      // Kirim  response sukses beserta cookie-nya ke client
      return response;
    }

    // Jika kredensial salah, kirim response JSON pesan gagal dengan status HTTP 401 (Unauthorized)
    return NextResponse.json(
      { message: 'Email atau password salah' },
      { status: 401 },
    );
  } catch (error) {
    // Tangkap semua error di catch supaya error internal tidak bocor ke client
    console.error('Login API Error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 },
    );
  }
};
