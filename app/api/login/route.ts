// Mengimpor utilitas NextResponse untuk mengirimkan BALASAN (response) dari server ke client
import { NextResponse } from 'next/server';

// Mendefinisikan fungsi handler untuk HTTP Method POST secara asynchronous
export const POST = async (request: Request) => {
  // Mengambil dan mengubah data mentah dari body request menjadi objek JSON (email & password)
  const body = await request.json();

  // MOCK DATABASE: Daftar user sederhana untuk simulasi
  const users = [
    { email: 'admin@mail.com', password: '123', role: 'admin' },
    { email: 'user@mail.com', password: '123', role: 'user' },
  ];

  // Cari user berdasarkan input email dan password
  const foundUser = users.find(
    (u) => u.email === body.email && u.password === body.password,
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    );

    // Misal backend mengirim token di 'body.token', maka gunakan:
    // response.cookies.set('token', body.token, {
    //   httpOnly: true, // Proteksi dari XSS
    //   secure: true,   // Hanya lewat HTTPS
    //   path: '/',      // Berlaku di semua route
    // });

    // Mengirimkan response sukses beserta cookie-nya kembali ke client
    return response;
  }

  // Jika kredensial salah, kirim response JSON pesan gagal dengan status HTTP 401 (Unauthorized)
  return NextResponse.json({ message: 'Login gagal' }, { status: 401 });
};
