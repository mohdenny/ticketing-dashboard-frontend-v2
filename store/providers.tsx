'use client';

import { Provider } from 'react-redux';
import { store } from './index'; // atau path store Anda
import { setUser } from './user/userSlice';

export default function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: any;
}) {
  // Jika Redux kosong tapi ada data dari Server, isi Redux segera
  if (initialUser && !store.getState().user.data) {
    store.dispatch(setUser(initialUser));
  }

  return <Provider store={store}>{children}</Provider>;
}
