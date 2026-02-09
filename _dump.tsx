const menuGroups = [
  {
    title: 'Utama',
    items: [{ name: 'Dashboard', href: '/', icon: LayoutDashboard }],
  },
  {
    title: 'Dukungan Teknis',
    items: [
      { name: 'Buat Tiket', href: '/tickets/create', icon: PlusCircle },
      { name: 'Kendala Sistem', href: '/tickets/system', icon: MonitorDot },
      { name: 'Perbaikan Hardware', href: '/tickets/hardware', icon: Cpu },
      { name: 'Akses Jaringan', href: '/tickets/network', icon: Network },
    ],
  },
  {
    title: 'Layanan Perawatan',
    items: [
      { name: 'Buat Permintaan', href: '/maintenance/create', icon: ClipboardEdit },
      { name: 'Perbaikan Fasilitas', href: '/maintenance/facility', icon: Building2 },
      { name: 'Utilitas Gedung', href: '/maintenance/utility', icon: Zap },
      { name: 'Pengecekan Rutin', icon: ShieldCheck, href: '/maintenance/routine' },
    ],
  },
  {
    title: 'Manajemen Aset',
    items: [
      { name: 'Buat Pengajuan', href: '/assets/create', icon: FilePlus2 },
      { name: 'Relokasi Barang', href: '/assets/relocation', icon: Truck },
      { name: 'Serah Terima', href: '/assets/handover', icon: Handshake },
      { name: 'Update Inventaris', href: '/assets/inventory', icon: Boxes },
    ],
  },
  {
    title: 'Suara Pemirsa',
    items: [
      { name: 'Buat Laporan', href: '/complaints/create', icon: MessageSquarePlus },
      { name: 'Keluhan Konten', href: '/complaints/content', icon: VideoOff },
      { name: 'Kualitas Siaran', href: '/complaints/broadcast', icon: RadioTower },
      { name: 'Kritik & Saran', href: '/complaints/feedback', icon: HeartHandshake },
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
