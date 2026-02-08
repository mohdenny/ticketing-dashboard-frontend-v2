// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  // Parsing role dari cookie (asumsi data tersimpan sebagai JSON string)
  let userRole = '';
  if (authCookie) {
    try {
      userRole = JSON.parse(authCookie.value).role;
    } catch (e) {
      userRole = '';
    }
  }

  // 1. DAFTAR HALAMAN YANG DIPROTEKSI (PROTECTED ROUTES)
  // Kamu tinggal tambah halaman di sini menggunakan ||
  const isProtectedRoute = pathname === '/' || pathname.startsWith('/tickets');

  // 2. LOGIKA PROTEKSI ADMIN
  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. LOGIKA BELUM LOGIN (Struktur asli kamu)
  if (isProtectedRoute && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. LOGIKA JIKA SUDAH LOGIN (Tidak boleh ke /login)
  if (pathname === '/login' && authCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
