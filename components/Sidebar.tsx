'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  if (pathname === '/login') return null;

  const menus = [
    { name: 'Dashboard', href: '/', icon: '🏠', sub: null },
    {
      name: 'Tickets',
      href: null,
      icon: '🎫',
      sub: [
        { label: 'Lihat Semua', path: '/tickets' },
        { label: 'Create Ticket', path: '/tickets/create' },
        { label: 'Urgent', path: '/tickets/urgent' },
        { label: 'History', path: '/tickets/history' },
        { label: 'Archived', path: '/tickets/archived' },
        { label: 'Spam', path: '/tickets/spam' },
      ],
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r h-full transition-all duration-300 shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b shrink-0">
        {!isCollapsed && (
          <span className="font-bold text-blue-600">PROTICKETS</span>
        )}
        <button
          onClick={() => {
            setIsCollapsed(!isCollapsed);
            setOpenSubmenu(null);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg ml-auto"
        >
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-visible p-3 space-y-2 custom-scrollbar">
        {menus.map((menu) => {
          const isDropdownOpen = openSubmenu === menu.name;
          const isParentActive = menu.sub?.some((s) => pathname === s.path);

          return (
            <div key={menu.name} className="relative group">
              <div
                onClick={() =>
                  !isCollapsed &&
                  menu.sub &&
                  setOpenSubmenu(isDropdownOpen ? null : menu.name)
                }
                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all cursor-pointer ${
                  pathname === menu.href || isParentActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'hover:bg-gray-50 text-gray-600'
                } ${!menu.href && !isCollapsed ? 'cursor-default' : ''}`}
              >
                {menu.href ? (
                  <Link
                    href={menu.href}
                    className="flex items-center gap-4 w-full"
                  >
                    <span className="text-xl shrink-0">{menu.icon}</span>
                    {!isCollapsed && (
                      <span className="font-medium truncate">{menu.name}</span>
                    )}
                  </Link>
                ) : (
                  <>
                    <span className="text-xl shrink-0">{menu.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="font-medium truncate">
                          {menu.name}
                        </span>
                        <span
                          className={`ml-auto text-[10px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        >
                          ▼
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              {!isCollapsed && isDropdownOpen && menu.sub && (
                <div className="mt-2 ml-9 space-y-1">
                  {menu.sub.map((s) => (
                    <Link
                      key={s.path}
                      href={s.path}
                      className={`block px-4 py-2 text-sm rounded-lg ${pathname === s.path ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* 2. POP-OVER: Ditambahkan pengecekan menu.sub agar Dashboard tidak muncul popover */}
              {isCollapsed && menu.sub && (
                <div className="fixed left-20 -mt-12 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col max-h-[80vh]">
                  <div className="p-3 font-bold border-b text-[11px] text-gray-500 uppercase tracking-widest bg-gray-50/80 rounded-t-xl">
                    {menu.name}
                  </div>
                  <div className="overflow-y-auto p-1 custom-scrollbar">
                    {menu.sub.map((s) => (
                      <Link
                        key={s.path}
                        href={s.path}
                        className={`block px-4 py-2.5 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-600 ${pathname === s.path ? 'text-blue-600 bg-blue-50' : ''}`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
