'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/user/userSlice';
import { useAuth } from '@/hooks/auth/useAuth';
import {
  BriefcaseBusiness,
  Activity,
  Server,
  Package,
  Users,
  BookOpen,
  LayoutDashboard,
  TicketX,
  Wrench,
  MessageSquareWarning,
  ScrollText,
  RadioTower,
  Signal,
  Zap,
  Tv2,
  Globe,
  MapPinned,
  Satellite,
  Cable,
  FileBadge,
  Boxes,
  ArrowLeftRight,
  Contact,
  Fingerprint,
  CalendarClock,
  TrendingUp,
  ShieldCheck,
  NotebookTabs,
  TerminalSquare,
  Menu,
  User,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAppSelector(selectUser);
  const { logout } = useAuth();
  const [isManualCollapsed, setIsManualCollapsed] = useState(false);

  if (pathname === '/login') return null;

  const isRail = isManualCollapsed;

  const menuGroups = [
    {
      title: 'Utama',
      shortLabel: 'Home',
      groupIcon: LayoutDashboard,
      items: [{ name: 'Dashboard', href: '/', icon: LayoutDashboard }],
    },
    {
      title: 'Operasional & Layanan',
      shortLabel: 'operational',
      groupIcon: BriefcaseBusiness,
      items: [
        {
          name: 'Tiket Kendala',
          href: '/operational/tickets/trouble',
          icon: TicketX,
        },
        {
          name: 'Pemeliharaan',
          href: '/operational/tickets/maintenance',
          icon: Wrench,
        },
        {
          name: 'Komplain Pemirsa',
          href: '/operational/tickets/complain',
          icon: MessageSquareWarning,
        },
        { name: 'Log Aktivitas', href: '/operational/log', icon: ScrollText },
      ],
    },
    {
      title: 'Monitoring Real-time',
      shortLabel: 'Monitoring',
      groupIcon: Activity,
      items: [
        {
          name: 'Pemancar Digital',
          href: '/monitoring/transmitter/digital',
          icon: RadioTower,
        },
        {
          name: 'Pemancar Backup',
          href: '/monitoring/tx-backup',
          icon: Signal,
        },
        {
          name: 'Power System (UPS/Genset)',
          href: '/monitoring/power',
          icon: Zap,
        },
        { name: 'Monitor Konten', href: '/monitoring/konten', icon: Tv2 },
        { name: 'Site Metro TV', href: '/monitoring/site-web', icon: Globe },
      ],
    },
    {
      title: 'Data Teknis & Infrastruktur',
      shortLabel: 'Infrastruktur',
      groupIcon: Server,
      items: [
        { name: 'Site & Transmisi', href: '/teknis/site', icon: MapPinned },
        { name: 'Antena & Tower', href: '/teknis/antena', icon: Satellite },
        { name: 'Sarana Penunjang', href: '/teknis/sarana', icon: Cable },
        { name: 'Izin Siaran (ISR)', href: '/teknis/isr', icon: FileBadge },
      ],
    },
    {
      title: 'Manajemen Aset',
      shortLabel: 'Aset',
      groupIcon: Package,
      items: [
        { name: 'Daftar Aset', href: '/aset/list', icon: Boxes },
        { name: 'Mutasi Aset', href: '/aset/mutasi', icon: ArrowLeftRight },
      ],
    },
    {
      title: 'Sumber Daya Manusia',
      shortLabel: 'SDM',
      groupIcon: Users,
      items: [
        { name: 'Daftar Karyawan', href: '/sdm/karyawan', icon: Contact },
        { name: 'Absensi', href: '/sdm/absensi', icon: Fingerprint },
        { name: 'Jadwal Shift', href: '/sdm/shift', icon: CalendarClock },
        { name: 'Grafik KPI', href: '/sdm/kpi', icon: TrendingUp },
      ],
    },
    {
      title: 'Pusat Data',
      shortLabel: 'Library',
      groupIcon: BookOpen,
      items: [
        { name: 'SOP Transmisi', href: '/library/sop', icon: ShieldCheck },
        { name: 'Manual Book', href: '/library/manuals', icon: NotebookTabs },
        {
          name: 'Trouble & Config',
          href: '/library/config',
          icon: TerminalSquare,
        },
      ],
    },
  ];

  return (
    <aside
      className={`
        hidden md:flex flex-col h-screen sticky top-0 bg-[#F3EDF7] border-r border-[#E6E0E9] transition-all duration-300 ease-in-out z-50
        ${isRail ? 'w-[88px] px-0 items-center overflow-visible' : 'w-72 p-3 items-stretch overflow-x-hidden'}
      `}
    >
      {/* Toggle Button */}
      <div
        className={`flex items-center shrink-0 mt-3 mb-4 ${isRail ? 'justify-center w-full' : 'justify-start px-2'}`}
      >
        <button
          onClick={() => setIsManualCollapsed(!isManualCollapsed)}
          className="p-3 text-[#49454F] hover:bg-[#E6E0E9] active:bg-[#D0BCFF] rounded-full transition-colors shrink-0 cursor-pointer relative z-50"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* User Profile */}
      <div
        className={`
          mb-6 bg-[#EADDFF] transition-all duration-300 shrink-0 flex items-center overflow-hidden
          ${isRail ? 'w-12 h-12 rounded-full justify-center p-0 mx-auto' : 'w-full p-3 rounded-[28px] justify-start'}
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

      {/* Navigation List */}
      <nav
        className={`
          flex-1 no-scrollbar
          ${isRail ? 'w-full flex flex-col items-center gap-4 overflow-visible' : 'space-y-6 overflow-y-auto overflow-x-hidden'}
        `}
      >
        {menuGroups.map((group) => {
          const isGroupActive = group.items.some(
            (item) => item.href === pathname,
          );
          const primaryHref = group.items[0]?.href || '#';
          const hasSubmenu = group.items.length > 1;

          if (isRail) {
            return (
              <div
                key={group.title}
                className="relative group w-full flex justify-center"
              >
                <Link
                  href={primaryHref}
                  className={`
                    flex flex-col items-center justify-center w-14 h-14 rounded-[16px] transition-colors duration-200 relative z-40
                    ${isGroupActive ? 'bg-[#E8DEF8] text-[#1D192B]' : 'text-[#49454F] hover:bg-[#F3F0F5] hover:text-[#1D192B]'}
                  `}
                >
                  <group.groupIcon
                    size={24}
                    strokeWidth={isGroupActive ? 2.5 : 2}
                    className="mb-1"
                  />
                  <span className="text-[11px] font-medium leading-none tracking-tight">
                    {group.shortLabel}
                  </span>
                </Link>

                {/* Submenu popover */}
                {hasSubmenu && (
                  <div className="absolute left-[60px] top-0 hidden group-hover:block z-30 pt-1 pl-4">
                    {/* Invisible Bridge */}
                    <div className="absolute top-0 left-0 w-8 h-full bg-transparent" />

                    {/* Container Menu */}
                    <div className="bg-[#F7F2FA] relative rounded-[12px] shadow-xl border border-[#E6E0E9] p-2 min-w-[210px] flex flex-col gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
                      <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#49454F] border-b border-[#E6E0E9]/50 mb-1">
                        {group.title}
                      </p>
                      {group.items.map((item) => {
                        const isSubActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`
                              flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                              ${isSubActive ? 'bg-[#E8DEF8] text-[#1D192B]' : 'text-[#49454F] hover:bg-[#E6E0E9]'}
                            `}
                          >
                            <item.icon size={18} className="mr-3 shrink-0" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // Expanded mode
          return (
            <div key={group.title} className="flex flex-col shrink-0">
              <p className="px-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#49454F] mb-3 whitespace-nowrap">
                {group.title}
              </p>
              <div className="flex flex-col space-y-1 items-stretch">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center transition-all duration-200 h-14 px-4 rounded-full justify-start relative
                        ${isActive ? 'bg-[#EADDFF] text-[#21005D]' : 'text-[#49454F] hover:bg-[#E6E0E9]'}
                      `}
                    >
                      <item.icon
                        size={24}
                        strokeWidth={isActive ? 2.5 : 2}
                        className="shrink-0"
                      />
                      <span className="ml-4 text-sm font-medium truncate whitespace-nowrap">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <div className="mx-4 mt-4 border-t border-[#E6E0E9] shrink-0" />
            </div>
          );
        })}
      </nav>

      {/* Footer*/}
      <div
        className={`mt-auto mb-3 shrink-0 flex ${isRail ? 'justify-center w-full' : 'justify-start px-3'}`}
      >
        <button
          onClick={logout}
          className={`
            flex items-center text-[#B3261E] hover:bg-[#FFDAD6] transition-all duration-200 shrink-0
            ${isRail ? 'flex-col justify-center w-14 h-14 rounded-[16px] gap-1' : 'w-full h-14 px-4 rounded-full gap-4 justify-start'}
          `}
        >
          <LogOut size={24} className="shrink-0" />
          {isRail ? (
            <span className="text-[10px] font-bold">Keluar</span>
          ) : (
            <span className="text-sm font-bold whitespace-nowrap">Keluar</span>
          )}
        </button>
      </div>
    </aside>
  );
}
