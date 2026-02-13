import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CancelActionProps {
  link: string;
  label: string;
}

export const CancelAction = ({ link, label }: CancelActionProps) => {
  return (
    <Link
      href={link}
      className="text-base text-gray-500 font-medium hover:text-[#6750A4] flex items-center gap-2 w-fit transition-colors"
    >
      <ArrowLeft size={16} /> {label}
    </Link>
  );
};
