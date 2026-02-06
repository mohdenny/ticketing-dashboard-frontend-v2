// Mengimpor utilitas NextResponse untuk mengirimkan BALASAN (response) dari server ke client
import { NextResponse } from 'next/server';

// Mendefinisikan fungsi handler untuk HTTP Method POST secara asynchronous
export const POST = async (request: Request) => {
  // Mengambil dan mengubah data mentah dari body request menjadi objek JSON (email & password)
  const body = await request.json();

  // Melakukan validasi kredensial (hardcoded) untuk mengecek apakah email dan password sesuai
  if (body.email === 'admin@mail.com' && body.password === '123456') {
    // Jika benar, buat objek response JSON dengan status success: true
    const response = NextResponse.json({ success: true });

    // Menyisipkan cookie 'auth' ke dalam browser user sebagai penanda sudah login
    // httpOnly: true menjaga agar cookie tidak bisa diakses melalui JavaScript di browser (lebih aman)
    // path: '/' memastikan cookie ini berlaku di seluruh folder/halaman website
    response.cookies.set('auth', 'true', {
      httpOnly: true,
      path: '/',
    });

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
