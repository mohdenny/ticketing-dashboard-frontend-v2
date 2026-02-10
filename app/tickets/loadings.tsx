'use client';

import { TicketRowSkeleton } from '@/components/layouts/Skeleton';

export default function Loading() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end mb-10">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-[#E6E0E9] animate-pulse rounded-lg" />
          <div className="h-4 w-80 bg-[#E6E0E9] animate-pulse rounded-lg" />
        </div>
        <div className="h-12 w-40 bg-[#E6E0E9] animate-pulse rounded-full" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-[28px] border border-[#E6E0E9] overflow-hidden">
        <div className="h-16 bg-[#F3EDF7]" /> {/* Table Header Shimmer */}
        <table className="w-full">
          <tbody>
            <TicketRowSkeleton />
            <TicketRowSkeleton />
            <TicketRowSkeleton />
            <TicketRowSkeleton />
            <TicketRowSkeleton />
          </tbody>
        </table>
      </div>
    </div>
  );
}
