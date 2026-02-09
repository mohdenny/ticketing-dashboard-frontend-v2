'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { useEffect, useState } from 'react';
import { setUser } from './user/userSlice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: any;
}) {
  // Inisiliasi query client
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

  // Sinkronisasi initialUser ke Redux
  useEffect(() => {
    if (initialUser) {
      store.dispatch(setUser(initialUser));
    }
  }, [initialUser]);

  return (
    <Provider store={store}>
      {/* Bungkus redux dan query client di provider */}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
