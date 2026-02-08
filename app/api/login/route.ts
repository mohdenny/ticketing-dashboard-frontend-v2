// Mengimpor utilitas NextResponse untuk mengirimkan BALASAN (response) dari server ke client
import { NextResponse } from 'next/server';
// BIG TECH NOTE: Gunakan schema yang sudah kita buat untuk validasi di sisi server (Single Source of Truth)
import { authSchema } from '@/schemas/authSchema';

// Mendefinisikan fungsi handler untuk HTTP Method POST secara asynchronous
export const POST = async (request: Request) => {
  try {
    // Mengambil dan mengubah data mentah dari body request menjadi objek JSON (email & password)
    const body = await request.json();

    // BIG TECH NOTE: Server-side validation. Jangan percaya data dari client begitu saja.
    const result = authSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Format data tidak valid', errors: result.error.format() },
        { status: 400 },
      );
    }

    const { email, password } = result.data;

    // MOCK DATABASE: Daftar user sederhana untuk simulasi
    const users = [
      { email: 'admin@mail.com', password: '123456', role: 'admin' },
      { email: 'user@mail.com', password: '123456', role: 'user' },
    ];

    // Cari user berdasarkan input email dan password
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    // Melakukan validasi kredensial (sekarang menggunakan data mock)
    if (foundUser) {
      // Jika benar, buat objek response JSON dengan status success: true
      // Kita sertakan data user agar Redux di client bisa langsung mendapatkan email & role
      const response = NextResponse.json({
        success: true,
        user: { email: foundUser.email, role: foundUser.role },
      });

      // Menyisipkan cookie 'auth' ke dalam browser user sebagai penanda sudah login
      // httpOnly: true menjaga agar cookie tidak bisa diakses melalui JavaScript di browser (lebih aman)
      // path: '/' memastikan cookie ini berlaku di seluruh folder/halaman website
      // Kita simpan objek JSON string supaya middleware bisa membaca properti 'role'
      response.cookies.set(
        'auth',
        JSON.stringify({ email: foundUser.email, role: foundUser.role }),
        {
          httpOnly: true,
          path: '/',
          // BIG TECH NOTE: Selalu pastikan secure aktif di production untuk mencegah intercept data
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          // BIG TECH NOTE: Tambahkan maxAge eksplisit agar session tidak hilang saat browser ditutup (persistent)
          maxAge: 60 * 60 * 24 * 7, // 7 Hari
        },
      );

      // Misal backend mengirim token di 'body.token', maka gunakan:
      // Pastikan body.token sudah berisi payload { email, role } yang di-sign oleh backend
      // response.cookies.set(
      //   'auth',
      //   body.token, // Simpan token JWT-nya, bukan JSON string biasa
      //   {
      //     httpOnly: true, // Mencegah akses via JS (XSS)
      //     path: '/',
      //     secure: process.env.NODE_ENV === 'production', // Hanya lewat HTTPS di prod
      //     sameSite: 'lax', // Proteksi CSRF standar
      //     maxAge: 60 * 60 * 24 * 7, // Rekomendasi: set masa berlaku (misal: 7 hari)
      //   },
      // );

      // Mengirimkan response sukses beserta cookie-nya kembali ke client
      return response;
    }

    // Jika kredensial salah, kirim response JSON pesan gagal dengan status HTTP 401 (Unauthorized)
    return NextResponse.json(
      { message: 'Email atau password salah' },
      { status: 401 },
    );
  } catch (error) {
    // BIG TECH NOTE: Tambahkan catch-all error handling untuk mencegah internal error bocor ke client
    console.error('Login API Error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 },
    );
  }
};
