interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  text?: string;
  description: string;
}

export default function TroubleStatCard({
  title,
  count,
  icon,
  color,
  description,
}: StatCardProps) {
  return (
    <div
      className={`${color} p-6 rounded-[28px] flex flex-col justify-between h-40 transition-transform hover:scale-[1.02] duration-200 cursor-default shadow-sm border border-black/5`}
    >
      <div className="flex justify-between items-start">
        <div className="p-2 bg-white/40 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
        <span className="text-4xl font-black tracking-tighter">{count}</span>
      </div>
      <div>
        <p className="text-sm font-bold leading-none mb-1">{title}</p>
        <p className="text-[10px] opacity-70 font-medium uppercase tracking-wider">
          {description}
        </p>
      </div>
    </div>
  );
}
