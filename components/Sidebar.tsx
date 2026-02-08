'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/user/userSlice';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  LogOut,
  User,
  Menu,
  ShieldCheck,
  Settings,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAppSelector(selectUser);
  const { logout } = useAuth();
  const [isManualCollapsed, setIsManualCollapsed] = useState(false);

  // PROTEKSI: Jangan render sidebar di halaman login
  if (pathname === '/login') return null;

  const isRail = isManualCollapsed;

  const menuGroups = [
    {
      title: 'Utama',
      items: [{ name: 'Dashboard', href: '/', icon: LayoutDashboard }],
    },
    {
      title: 'Tiket',
      items: [
        { name: 'Tiket Saya', href: '/tickets', icon: Ticket },
        { name: 'Buat Tiket', href: '/tickets/create', icon: PlusCircle },
      ],
    },
    {
      title: 'Sistem',
      items: [
        { name: 'Admin Panel', href: '/admin', icon: ShieldCheck },
        { name: 'Setelan', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`
        hidden md:flex flex-col h-screen sticky top-0 bg-[#F3EDF7] border-r border-[#E6E0E9] p-3 transition-all duration-300 ease-in-out z-40 overflow-x-hidden
        ${isRail ? 'w-20' : 'w-72'}
      `}
    >
      <div
        className={`flex items-center mb-4 shrink-0 ${isRail ? 'justify-center' : 'justify-start px-2'}`}
      >
        <button
          onClick={() => setIsManualCollapsed(!isManualCollapsed)}
          className="p-3 text-[#49454F] hover:bg-[#E6E0E9] rounded-full transition-colors shrink-0"
        >
          <Menu size={24} />
        </button>
      </div>

      <div
        className={`
        mb-6 p-3 bg-[#EADDFF] rounded-[28px] flex items-center transition-all duration-300 shrink-0
        ${isRail ? 'justify-center w-12 h-12 mx-auto' : 'w-full justify-start'}
      `}
      >
        <div className="w-10 h-10 shrink-0 rounded-full bg-[#6750A4] flex items-center justify-center text-white shadow-sm">
          <User size={20} />
        </div>
        {!isRail && (
          <div className="ml-3 flex flex-col min-w-0">
            <p className="text-sm font-bold truncate text-[#1C1B1F] leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-[10px] text-[#49454F] uppercase tracking-wider font-medium">
              {user?.role || 'Guest'}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto no-scrollbar overflow-x-hidden">
        {menuGroups.map((group) => (
          <div key={group.title} className="flex flex-col shrink-0">
            {!isRail && (
              <p className="px-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#49454F] mb-3 whitespace-nowrap">
                {group.title}
              </p>
            )}
            <div
              className={`flex flex-col space-y-1 ${isRail ? 'items-center' : 'items-stretch'}`}
            >
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center transition-all duration-200 relative group shrink-0
                      ${isActive ? 'bg-[#EADDFF] text-[#21005D]' : 'text-[#49454F] hover:bg-[#E6E0E9]'}
                      ${isRail ? 'w-12 h-12 justify-center rounded-full' : 'w-full h-14 px-4 rounded-full justify-start'}
                    `}
                  >
                    <item.icon
                      size={24}
                      strokeWidth={isActive ? 2.5 : 2}
                      className="shrink-0"
                    />
                    {!isRail && (
                      <span className="ml-4 text-sm font-medium truncate whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                    {isRail && (
                      <div className="absolute left-16 bg-[#1C1B1F] text-[#F4EFF4] text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
            {!isRail && (
              <div className="mx-4 mt-4 border-t border-[#E6E0E9] shrink-0" />
            )}
          </div>
        ))}
      </nav>

      <div
        className={`mt-auto flex shrink-0 ${isRail ? 'justify-center' : 'justify-start px-2'}`}
      >
        <button
          onClick={logout}
          className={`
            flex items-center text-[#B3261E] hover:bg-[#FFDAD6] transition-all duration-200 shrink-0
            ${isRail ? 'w-12 h-12 justify-center rounded-full' : 'w-full h-14 px-4 rounded-full gap-4 justify-start'}
          `}
        >
          <LogOut size={24} className="shrink-0" />
          {!isRail && (
            <span className="text-sm font-bold whitespace-nowrap">Keluar</span>
          )}
        </button>
      </div>
    </aside>
  );
}
