'use client';

import { CheckCircle2, Circle, Clock, User } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  user?: string;
  isLast?: boolean;
}

interface TimelineProps {
  events: TimelineEvent[];
  emptyMessage?: string;
}

export default function Timeline({
  events,
  emptyMessage = 'Belum ada aktivitas',
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
        return (
          <div key={event.id} className="relative flex gap-4 pb-8 group">
            {/* Garis Vertikal */}
            {!isLast && (
              <div className="absolute left-[15px] top-[30px] bottom-0 w-[2px] bg-[#E6E0E9] group-hover:bg-[#6750A4] transition-colors" />
            )}

            {/* Dot Indikator */}
            <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#EADDFF] text-[#21005D] shrink-0 shadow-sm">
              {isLast ? (
                <CheckCircle2 size={16} />
              ) : (
                <Circle size={10} fill="currentColor" />
              )}
            </div>

            {/* Konten Log */}
            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1C1B1F]">
                  {event.title}
                </span>
                <span className="text-[10px] text-[#938F99] font-medium">
                  •
                </span>
                <span className="text-[11px] text-[#49454F] font-medium">
                  {new Date(event.date).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-sm text-[#49454F] leading-relaxed italic bg-white/50 p-3 rounded-xl border border-[#E6E0E9] mt-1">
                "{event.description}"
              </p>
              {event.user && (
                <div className="flex items-center gap-1.5 mt-1 text-[#6750A4]">
                  <User size={12} />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {event.user}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
