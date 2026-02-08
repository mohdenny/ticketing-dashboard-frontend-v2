'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const pathname = usePathname();
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const user = useAppSelector((state) => state.user.data);
  const { logout } = useAuth();

  if (pathname === '/login') return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    router.push(`/tickets?q=${encodeURIComponent(keyword)}`);
    setKeyword('');
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-40 shrink-0 gap-4">
      {/* SEARCH GLOBAL */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
        <input
          type="text"
          placeholder="Cari No. Tiket atau Judul..."
          className="w-full bg-gray-100 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </form>

      {/* USER INFO & AUTH */}
      <div className="flex items-center gap-4 ml-auto">
        {user ? (
          <>
            <div className="flex flex-col items-end leading-tight">
              <span className="text-sm font-bold text-gray-900">
                {user.email}
              </span>
              <span
                className={`text-[10px] uppercase font-bold ${user.role === 'admin' ? 'text-purple-600' : 'text-blue-600'}`}
              >
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="bg-black text-white px-4 py-1.5 rounded-lg text-xs"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
