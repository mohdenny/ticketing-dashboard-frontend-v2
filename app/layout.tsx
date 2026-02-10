import './globals.css';
import Header from '@/components/layouts/Header';
import Sidebar from '@/components/layouts/Sidebar';
import BottomNav from '@/components/layouts/BottomNav';
import { Toaster } from 'sonner';
import Providers from '@/store/providers';
import { cookies } from 'next/headers';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Ticketing System | Support',
  description: 'Sistem manajemen tiket bantuan internal',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Mencegah zoom yang merusak layout di HP
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth');

  let initialUser = null;
  if (authCookie) {
    try {
      initialUser = JSON.parse(authCookie.value);
    } catch (e) {
      initialUser = null;
    }
  }

  return (
    <html lang="id">
      {/* Hapus w-screen, gunakan max-w-full.
        antialiased agar font lebih tajam.
      */}
      <body className="min-h-screen max-w-full bg-[#F3EDF7] antialiased overflow-x-hidden">
        <Providers initialUser={initialUser}>
          <div className="flex h-screen w-full overflow-hidden relative">
            {/* Sidebar: Otomatis hilang di mobile via usePathname & Tailwind hidden md:flex */}
            <Sidebar />

            <div className="flex flex-col flex-1 min-w-0 h-full relative overflow-hidden">
              <Header />

              {/* Main Content:
                - flex-1 agar mengambil sisa ruang.
                - overflow-y-auto agar bisa scroll vertikal.
                - pb-24 untuk memberi ruang bagi BottomNav di mobile.
              */}
              <main className="flex-1 overflow-y-auto overflow-x-hidden p-0 md:p-0">
                <div className="w-full min-h-full pb-24 md:pb-0">
                  {children}
                </div>
              </main>
            </div>

            {/* BottomNav: Hanya muncul di mobile */}
            <BottomNav />
          </div>

          <Toaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
              style: { borderRadius: '12px' },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
