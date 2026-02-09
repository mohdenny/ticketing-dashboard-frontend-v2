'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  caption: string;
  label: string;
}

export default function PageHeader({ title, caption, label }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div>
        <h1 className="text-[32px] font-medium text-[#1C1B1F] tracking-tight">
          {title}
        </h1>
        <p className="text-[#49454F] mt-1 text-base">{caption}</p>
      </div>

      <Link
        href="/tickets/create"
        className="flex items-center justify-center gap-3 bg-[#6750A4] text-white px-6 py-4 rounded-[16px] font-medium shadow-md hover:shadow-lg active:scale-95 transition-all"
      >
        <Plus size={20} /> {label}
      </Link>
    </div>
  );
}
