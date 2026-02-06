// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  // PROTEKSI LEBIH DARI SATU HALAMAN:
  // Gunakan operator "||" (ATAU) untuk menambah daftar halaman yang diproteksi.
  // Contoh: const isProtectedRoute = request.nextUrl.pathname.startsWith("/tickets") || request.nextUrl.pathname.startsWith("/dashboard")
  const isProtectedRoute = pathname.startsWith('/tickets');

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // PADA MATCHER:
  // bisa menambahkan list halaman di dalam array matcher.
  // Contoh: matcher: ["/tickets/:path*", "/dashboard/:path*", "/profile/:path*"]
  matcher: ['/tickets/:path*'],
};
