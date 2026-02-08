'use client';

import { Provider } from 'react-redux';
import { store } from './index'; // atau path store kamu
import { useEffect, useState } from 'react';
import { setUser } from './user/userSlice';
// --- TAMBAHKAN INI ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: any;
}) {
  // --- INISIALISASI QUERY CLIENT ---
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  // Logika sinkronisasi initialUser ke Redux
  useEffect(() => {
    if (initialUser) {
      store.dispatch(setUser(initialUser));
    }
  }, [initialUser]);

  return (
    <Provider store={store}>
      {/* BUNGKUS REDUX DENGAN QUERY CLIENT PROVIDER */}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
