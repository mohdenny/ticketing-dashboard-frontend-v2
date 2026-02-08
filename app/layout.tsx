import './globals.css';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import { Toaster } from 'sonner';
import Providers from '@/store/providers';
// Tambahkan import cookies dari next/headers
import { cookies } from 'next/headers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // LOGIKA: Ambil data dari cookie 'auth' di sisi server
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
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col">
        {/* Teruskan initialUser ke Providers tanpa merubah style apa pun */}
        <Providers initialUser={initialUser}>
          <div className="flex flex-1 overflow-hidden h-full">
            {/* SIDEBAR: Muncul hanya di Desktop (lg ke atas) */}
            <Sidebar />

            <div className="flex flex-col flex-1 min-w-0 relative h-full">
              {/* HEADER: Tetap di atas, tidak ikut scroll */}
              <Header />

              {/* MAIN CONTENT: Area yang bisa scroll sendiri */}
              <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 lg:pb-8">
                <div className="max-w-5xl mx-auto">{children}</div>
              </main>
            </div>
          </div>

          {/* BOTTOM NAV: Muncul hanya di Mobile (di bawah lg) */}
          <BottomNav />
          <Toaster position="top-center" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
