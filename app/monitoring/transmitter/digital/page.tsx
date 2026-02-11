'use client';

import { use } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  Calendar,
  History,
  Edit,
  Eye,
  MoreVertical,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import PageTitle from '@/components/layouts/PageTitle';

// --- 1. DUMMY DATA ---
const timeSeriesData = [
  { time: '00:00', power: 0, temp: 28, snr: 35, im: -35, press: 45, hpa1: 0, hpa2: 0, hpa3: 0 },
  { time: '02:00', power: 8.2, temp: 42, snr: 35, im: -35, press: 45, hpa1: 1100, hpa2: 1050, hpa3: 1080 },
  { time: '04:00', power: 0, temp: 29, snr: 0, im: 0, press: 0, hpa1: 0, hpa2: 0, hpa3: 0 },
  { time: '06:00', power: 0, temp: 28, snr: 0, im: 0, press: 0, hpa1: 0, hpa2: 0, hpa3: 0 },
  { time: '08:00', power: 8.5, temp: 43, snr: 35, im: -35, press: 45, hpa1: 1120, hpa2: 1060, hpa3: 1090 },
  { time: '10:00', power: 8.1, temp: 41, snr: 35, im: -35, press: 45, hpa1: 1110, hpa2: 1055, hpa3: 1085 },
];

// --- 2. REUSABLE COMPONENTS ---

// Wrapper Card M3 Style
const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-[#FEF7FF] border border-[#CAC4D0] rounded-[24px] p-6 shadow-sm flex flex-col h-[350px]">
    <div className="flex justify-between items-center mb-4 border-b border-[#E7E0EC] pb-2">
      <h3 className="text-base font-bold text-[#6750A4]">{title}</h3>
      <button className="text-[#49454F] hover:bg-[#F3EDF7] p-1 rounded-full transition-colors">
        <MoreVertical size={18} />
      </button>
    </div>
    <div className="flex-1 w-full min-h-0">{children}</div>
  </div>
);

// Custom Tooltip M3
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#F3EDF7] border border-[#CAC4D0] p-3 rounded-xl shadow-md text-xs">
        <p className="font-bold text-[#1D1B20] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Grafik Area (Untuk Main Power & Exciter)
const ReusableAreaChart = ({ data, dataKey, color, unit, yDomain }: any) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.2} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E0EC" />
      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#49454F' }} dy={10} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#49454F' }} unit={unit ? ` ${unit}` : ''} domain={yDomain || [0, 'auto']} />
      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6750A4', strokeWidth: 1, strokeDasharray: '3 3' }} />
      <Area
        type="monotone"
        dataKey={dataKey}
        stroke={color}
        strokeWidth={3}
        fillOpacity={1}
        fill={`url(#color${dataKey})`}
        dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }}
        activeDot={{ r: 6 }}
        animationDuration={1000}
      />
    </AreaChart>
  </ResponsiveContainer>
);

// Grafik Bar Simple (Untuk Temperature & Pressure)
const ReusableBarChart = ({ data, dataKey, color, unit }: any) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E0EC" />
      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#49454F' }} dy={10} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#49454F' }} unit={unit ? ` ${unit}` : ''} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#E8DEF8', opacity: 0.4 }} />
      <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} barSize={40} />
    </BarChart>
  </ResponsiveContainer>
);

// Grafik Bar Grouped/Stacked (Untuk SNR & Forward Power)
const ReusableMultiBarChart = ({ data, keys, colors, unit, stackId }: any) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E0EC" />
      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#49454F' }} dy={10} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#49454F' }} unit={unit ? ` ${unit}` : ''} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#E8DEF8', opacity: 0.4 }} />
      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
      {keys.map((key: string, index: number) => (
        <Bar
          key={key}
          dataKey={key}
          fill={colors[index]}
          stackId={stackId}
          radius={[4, 4, 0, 0]}
          barSize={20} // Lebih ramping untuk grouped
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

// --- 3. MAIN PAGE ---
export default function MonitoringTxDigitalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const query = resolvedSearchParams.q || '';

  return (
    <div className="min-h-screen bg-[#FDFCFF] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER CUSTOM (Sesuai Gambar) */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#FEF7FF] p-4 rounded-[24px] border border-[#CAC4D0] shadow-sm">
          
          {/* Bagian Kiri: Title & Filter Date */}
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-normal text-[#1D1B20]">
              Grafik Metering NEC 10,9KW (Digital) <span className="font-bold text-[#6750A4]">Site Surabaya</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="relative">
                <select className="pl-3 pr-8 py-2 bg-white border border-[#79747E] rounded-[12px] text-sm text-[#49454F] outline-none focus:border-[#6750A4]">
                  <option>Today</option>
                  <option>Yesterday</option>
                </select>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="date" 
                  className="pl-3 pr-3 py-2 bg-white border border-[#79747E] rounded-[12px] text-sm text-[#49454F] outline-none focus:border-[#6750A4]"
                  defaultValue="2026-02-11"
                />
              </div>
              <button className="flex items-center gap-2 bg-[#6750A4] text-white px-4 py-2 rounded-[12px] text-sm font-medium hover:bg-[#523E85] transition-colors shadow-sm">
                <Eye size={16} /> Check
              </button>
            </div>
          </div>

          {/* Bagian Kanan: Action Buttons */}
          <div className="flex items-center gap-2 self-end lg:self-center">
            <button className="flex items-center gap-2 bg-[#00C853] text-white px-4 py-2 rounded-[12px] text-sm font-medium hover:bg-[#009624] transition-colors shadow-sm">
              <Edit size={16} /> Input Content
            </button>
            <button className="flex items-center gap-2 bg-[#D32F2F] text-white px-4 py-2 rounded-[12px] text-sm font-medium hover:bg-[#B71C1C] transition-colors shadow-sm">
              <History size={16} /> History
            </button>
          </div>
        </div>

        {/* GRID CHARTS */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Main Power */}
          <ChartCard title="Main Power">
            <ReusableAreaChart 
              data={timeSeriesData} 
              dataKey="power" 
              color="#00C853" // Green
              unit="kW"
              yDomain={[0, 10]}
            />
          </ChartCard>

          {/* 2. Temperature */}
          <ChartCard title="Temperature">
            <ReusableBarChart 
              data={timeSeriesData} 
              dataKey="temp" 
              color="#448AFF" // Blue
              unit="°C"
            />
          </ChartCard>

          {/* 3. Power Exciter A */}
          <ChartCard title="Power Exciter A">
            <ReusableAreaChart 
              data={timeSeriesData} 
              dataKey="power" // Menggunakan dummy power yg sama utk simulasi
              color="#00C853"
              unit="%" 
              yDomain={[0, 100]}
            />
          </ChartCard>

          {/* 4. Power Exciter B */}
          <ChartCard title="Power Exciter B">
            <ReusableAreaChart 
              data={timeSeriesData} 
              dataKey="power" 
              color="#00C853" 
              unit="%"
              yDomain={[0, 100]}
            />
          </ChartCard>

          {/* 5. SNR & IM */}
          <ChartCard title="SNR & IM">
            <ReusableMultiBarChart 
              data={timeSeriesData} 
              keys={['snr', 'im']} 
              colors={['#448AFF', '#00C853']}
              unit="dB"
            />
          </ChartCard>

          {/* 6. Pressure */}
          <ChartCard title="Pressure">
            <ReusableBarChart 
              data={timeSeriesData} 
              dataKey="press" 
              color="#448AFF"
              unit="L/min"
            />
          </ChartCard>

          {/* 7. Forward Power HPA1-HPA3 */}
          <ChartCard title="Forward Power HPA1-HPA3">
            <ReusableMultiBarChart 
              data={timeSeriesData} 
              keys={['hpa1', 'hpa2', 'hpa3']} 
              colors={['#448AFF', '#00C853', '#FFC107']} // Blue, Green, Yellow
              unit="W"
            />
          </ChartCard>

          {/* 8. Reflect Power HPA1-HPA3 */}
          <ChartCard title="Reflect Power HPA1-HPA3">
             <ReusableAreaChart 
              data={timeSeriesData} 
              dataKey="power" // Dummy low value
              color="#D32F2F" // Red for reflect/error warning
              unit="W"
              yDomain={[0, 100]}
            />
          </ChartCard>

           {/* 9. Forward Power HPA4-HPA6 */}
           <ChartCard title="Forward Power HPA4-HPA6">
            <ReusableMultiBarChart 
              data={timeSeriesData} 
              keys={['hpa1', 'hpa2', 'hpa3']} 
              colors={['#448AFF', '#00C853', '#FFC107']} 
              unit="W"
            />
          </ChartCard>

          {/* 10. Reflect Power HPA4-HPA6 */}
          <ChartCard title="Reflect Power HPA4-HPA6">
             <ReusableAreaChart 
              data={timeSeriesData} 
              dataKey="power" 
              color="#D32F2F"
              unit="W"
              yDomain={[0, 100]}
            />
          </ChartCard>

        </div>
      </div>
    </div>
  );
}
