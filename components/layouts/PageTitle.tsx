import Link from 'next/link';
import { Plus } from 'lucide-react'; // Gunakan library icon seperti lucide

interface PageTitleProps {
  title: string;
  description: string;
  // Menggunakan Object agar lebih deskriptif
  actionButton?: {
    link: string;
    label: string;
  };
}

export default function PageTitle({
  title,
  description,
  actionButton,
}: PageTitleProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div>
        <h1 className="text-[32px] font-medium text-[#1C1B1F] tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-[#49454F] mt-1 text-base leading-relaxed">
          {description}
        </p>
      </div>

      {actionButton && (
        <Link
          href={actionButton.link}
          className="flex items-center justify-center gap-2 bg-[#6750A4] text-white px-6 py-3.5 rounded-full font-medium shadow-sm hover:shadow-md active:scale-95 transition-all w-fit"
        >
          <Plus size={20} />
          <span>{actionButton.label}</span>
        </Link>
      )}
    </div>
  );
}
