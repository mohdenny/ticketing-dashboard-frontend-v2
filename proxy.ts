// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// BIG TECH NOTE: Gunakan nama fungsi 'middleware' agar dikenali otomatis oleh Next.js
export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  // Parsing role dari cookie (asumsi data tersimpan sebagai JSON string)
  let userRole = '';
  if (authCookie) {
    try {
      // BIG TECH NOTE: Di sistem skala besar, data cookie biasanya di-decrypt (JWT).
      // Karena kita pakai JSON string, pastikan parsing aman dari crash.
      userRole = JSON.parse(authCookie.value).role;
    } catch (e) {
      userRole = '';
    }
  }

  // 1. DAFTAR HALAMAN YANG DIPROTEKSI (PROTECTED ROUTES)
  // Kamu tinggal tambah halaman di sini menggunakan ||
  const isProtectedRoute =
    pathname === '/' || pathname.startsWith('/operasional');

  // 2. LOGIKA PROTEKSI ADMIN
  // Standar keamanan: Akses yang tidak sah ke area admin harus dilempar ke root atau 404
  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. LOGIKA BELUM LOGIN (Struktur asli kamu)
  if (isProtectedRoute && !authCookie) {
    // BIG TECH NOTE: Tambahkan query param 'callbackUrl' agar setelah login user balik ke halaman terakhir
    const loginUrl = new URL('/login', request.url);
    // loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. LOGIKA JIKA SUDAH LOGIN (Tidak boleh ke /login)
  if (pathname === '/login' && authCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Konfigurasi Matcher: Sudah sangat baik untuk mengecualikan file internal & statis
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
