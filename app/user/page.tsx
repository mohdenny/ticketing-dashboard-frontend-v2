'use client';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { login, logout } from '@/store/user/userSlice';

export default function User() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="flex gap-4 items-center">
      {user.isAuthenticated ? (
        <>
          <span>{user.email}</span>
          <button onClick={() => dispatch(logout())}>Logout</button>
        </>
      ) : (
        <button onClick={() => dispatch(login('admin@mail.com'))}>Login</button>
      )}
    </div>
  );
}
