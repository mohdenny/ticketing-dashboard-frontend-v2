'use client';

// Komponen skeleton dasar dengan animasi "pulse" M3
export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[#E6E0E9] rounded-xl ${className}`} />
  );
}

// Skeleton khusus untuk baris tabel tiket
export function TicketRowSkeleton() {
  return (
    <tr className="border-b border-[#E6E0E9]">
      <td className="px-8 py-5">
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-3 w-32" />
      </td>
      <td className="px-8 py-5">
        <Skeleton className="h-6 w-20 rounded-full" />
      </td>
      <td className="px-8 py-5">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-8 py-5 text-right">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </td>
    </tr>
  );
}
