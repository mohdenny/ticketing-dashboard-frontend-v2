import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  actionButton?: {
    link: string;
    label: string;
    icon: LucideIcon;
  };
}

export default function PageHeader({
  title,
  description,
  actionButton,
}: PageHeaderProps) {
  const Icon = actionButton?.icon;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-lg">
      <div>
        <h1 className="text-[32px] font-medium text-[#1C1B1F] tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-[#49454F] mt-1 text-base leading-relaxed">
          {description}
        </p>
      </div>

      {actionButton && Icon && (
        <Link
          href={actionButton.link}
          className="flex items-center justify-center gap-2 bg-[#6750A4] text-white px-6 py-3.5 rounded-full font-medium shadow-sm hover:shadow-md active:scale-95 transition-all w-fit"
        >
          <Icon size={20} />
          <span>{actionButton.label}</span>
        </Link>
      )}
    </div>
  );
}
