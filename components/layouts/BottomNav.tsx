'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Ticket, Plus, User, Settings } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Jangan render di login
  if (pathname === '/login') return null;

  const items = [
    { name: 'Beranda', href: '/', icon: LayoutDashboard },
    { name: 'Tiket', href: '/operasional/tickets', icon: Ticket },
    {
      name: 'Tambah',
      href: '/operasional/tickets/trouble/create',
      icon: Plus,
      isFAB: true,
    },
    { name: 'Profil', href: '/profile', icon: User },
    { name: 'Setelan', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#F3EDF7] border-t border-[#E6E0E9] flex justify-around items-center z-50 px-2 pb-safe">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        if (item.isFAB) {
          return (
            <div
              key={item.name}
              className="relative flex-1 flex flex-col items-center justify-center h-full"
            >
              <Link
                href={item.href}
                className="absolute -top-8 bg-[#EADDFF] text-[#21005D] w-14 h-14 rounded-[16px] flex items-center justify-center shadow-lg active:scale-95 transition-all border border-[#E6E0E9]"
              >
                <Icon size={28} strokeWidth={3} />
              </Link>
              <span className="mt-8 text-[11px] font-medium text-[#49454F]">
                {item.name}
              </span>
            </div>
          );
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center h-full group"
          >
            <div className="relative flex flex-col items-center">
              <div className="relative flex items-center justify-center w-16 h-8 mb-1">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive ? 'bg-[#EADDFF] opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                />
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`relative transition-colors ${isActive ? 'text-[#21005D]' : 'text-[#49454F]'}`}
                />
              </div>
              <span
                className={`text-[11px] transition-colors ${isActive ? 'font-bold text-[#1C1B1F]' : 'font-medium text-[#49454F]'}`}
              >
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
