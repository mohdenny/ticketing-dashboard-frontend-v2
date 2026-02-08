'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname === '/login') return null;

  const items = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Tickets', href: '/tickets', icon: '🎫' },
    { name: 'Add', href: '/tickets/create', icon: '➕', special: true },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex justify-around items-center px-2 z-50 shadow-inner">
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="flex flex-col items-center justify-center w-full h-full gap-1"
        >
          {item.special ? (
            <div className="bg-blue-600 text-white p-3 rounded-2xl -mt-12 shadow-lg border-4 border-gray-50 active:scale-90 transition-transform">
              <span className="text-xl leading-none">{item.icon}</span>
            </div>
          ) : (
            <>
              <span
                className={`text-xl ${pathname === item.href ? 'text-blue-600' : 'text-gray-400'}`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-bold ${pathname === item.href ? 'text-blue-600' : 'text-gray-400 uppercase'}`}
              >
                {item.name}
              </span>
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}
