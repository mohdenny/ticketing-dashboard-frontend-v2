'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';
import { Search, LogOut, User } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [keyword, setKeyword] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Ambil user dari Redux
  const user = useAppSelector((state) => state.user.data);
  const { logout } = useAuth();

  // Jangan render di halaman login
  if (pathname === '/login') return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    // Gunakan router.push dengan shallow routing jika memungkinkan
    // atau arahkan langsung ke list tiket dengan query
    router.push(`/tickets?q=${encodeURIComponent(keyword.trim())}`);
  };

  const onLogoutClick = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40 shrink-0 gap-4">
      {/* GLOBAL SEARCH */}
      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-md hidden sm:flex items-center relative group"
      >
        <Search className="absolute left-3 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
        <input
          type="text"
          placeholder="Cari ID tiket atau judul..."
          className="w-full bg-gray-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all placeholder:text-gray-400"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </form>

      {/* USER ACTIONS */}
      <div className="flex items-center gap-3 ml-auto">
        {user && (
          <div className="flex items-center gap-4">
            {/* User Profile Info */}
            <div className="flex flex-col items-end leading-tight hidden xs:flex">
              <span className="text-sm font-semibold text-gray-900 tracking-tight">
                {user.email.split('@')[0]} {/* More personal feel */}
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase font-black tracking-wider ${
                  user.role === 'admin'
                    ? 'bg-purple-50 text-purple-600 border border-purple-100'
                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* Avatar Placeholder */}
            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              <User size={18} className="text-gray-500" />
            </div>

            <div className="h-6 w-px bg-gray-200 mx-1" />

            {/* Logout Button */}
            <button
              onClick={onLogoutClick}
              disabled={isLoggingOut}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all group relative"
              title="Logout"
            >
              <LogOut
                size={20}
                className={isLoggingOut ? 'animate-pulse' : ''}
              />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
