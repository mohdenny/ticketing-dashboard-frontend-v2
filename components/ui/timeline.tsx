'use client';

import { CheckCircle2, Circle, Clock, User } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  user?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  emptyMessage?: string;
  // Prop ini krusial untuk menentukan styling item terakhir
  status?: 'open' | 'process' | 'closed';
}

export default function Timeline({
  events,
  emptyMessage = 'Belum ada aktivitas',
  status,
}: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-[#F7F2FA] rounded-[24px] border border-dashed border-[#CAC4D0]">
        <Clock size={32} className="text-[#938F99] mb-2" />
        <p className="text-sm text-[#49454F] font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const isClosed = status === 'closed';

        // --- Logic Styling ---
        const dotBg = isLast ? 'bg-[#EADDFF]' : 'bg-gray-100';
        const dotColor = isLast ? 'text-[#21005D]' : 'text-gray-400';
        const lineColor = 'bg-gray-200';
        const titleColor = isLast ? 'text-[#1C1B1F]' : 'text-gray-500';
        const boxStyle = isLast
          ? 'bg-white/50 border-[#E6E0E9]'
          : 'bg-gray-50/50 border-gray-100 opacity-80';

        // --- Logic Konten ---
        // Jika ini item terakhir DAN status tiket Closed -> Ubah Judul & Icon
        const showCheckmark = isLast && isClosed;

        let displayTitle = event.title;
        if (isLast && isClosed) {
          // Override judul jika tiket sudah ditutup
          displayTitle = 'Ticket Closed';
        }

        return (
          <div key={event.id} className="relative flex gap-4 pb-8 group">
            {/* Garis Vertikal */}
            {!isLast && (
              <div
                className={`absolute left-[15px] top-[30px] bottom-0 w-[2px] ${lineColor} group-hover:bg-[#6750A4]/30 transition-colors`}
              />
            )}

            {/* Dot Indikator */}
            <div
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${dotBg} ${dotColor} shrink-0 shadow-sm transition-colors duration-300`}
            >
              {showCheckmark ? (
                <CheckCircle2 size={16} />
              ) : (
                <Circle
                  size={isLast ? 12 : 10}
                  fill="currentColor"
                  className={!isLast ? 'opacity-50' : ''}
                />
              )}
            </div>

            {/* Konten Log */}
            <div className="flex flex-col gap-1 pt-1 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-bold ${titleColor}`}>
                  {displayTitle}
                </span>
                <span className="text-[10px] text-[#938F99] font-medium">
                  •
                </span>
                <span className="text-[11px] text-[#49454F] font-medium">
                  {new Date(event.date).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div
                className={`p-3 rounded-xl border mt-1 transition-colors ${boxStyle}`}
              >
                <p className="text-sm text-[#49454F] leading-relaxed italic">
                  "{event.description}"
                </p>
                {event.user && (
                  <div
                    className={`flex items-center gap-1.5 mt-2 ${isLast ? 'text-[#6750A4]' : 'text-gray-400'}`}
                  >
                    <User size={12} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      {event.user}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
