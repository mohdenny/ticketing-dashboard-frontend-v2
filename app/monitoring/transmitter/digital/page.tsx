'use client';

import { useState, use } from 'react';
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
  History,
  Edit,
  Eye,
  MoreVertical,
  Calendar,
  Save,
  ArrowLeft,
  Tv, // Icon untuk Video/Audio
} from 'lucide-react';

// --- 1. DUMMY DATA CHART ---
const timeSeriesData = [
  { time: '00:00', power: 0, temp: 28, snr: 35, im: -35, press: 45, hpa1: 0, hpa2: 0, hpa3: 0 },
  { time: '02:00', power: 8.2, temp: 42, snr: 35, im: -35, press: 45, hpa1: 1100, hpa2: 1050, hpa3: 1080 },
  { time: '04:00', power: 0, temp: 29, snr: 0, im: 0, press: 0, hpa1: 0, hpa2: 0, hpa3: 0 },
  { time: '06:00', power: 0, temp: 28, snr: 0, im: 0, press: 0, hpa1: 0, hpa2: 0, hpa3: 0 },
  { time: '08:00', power: 8.5, temp: 43, snr: 35, im: -35, press: 45, hpa1: 1120, hpa2: 1060, hpa3: 1090 },
  { time: '10:00', power: 8.1, temp: 41, snr: 35, im: -35, press: 45, hpa1: 1110, hpa2: 1055, hpa3: 1085 },
];

// --- 2. DUMMY DATA INPUT TABLE ---
const inputChannels = [
  'BBS TV', 'BN CHANNEL', 'JAWA POS', 'JTV', 
  'MADU TV NUSANTARA', 'MAGNA CHANNEL', 'METRO TV HD', 'TV9 NUSANTARA'
];
const timeSlots = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

// --- 3. REUSABLE CHART COMPONENTS (M3) ---
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
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#color${dataKey})`} dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }} />
    </AreaChart>
  </ResponsiveContainer>
);

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

const ReusableMultiBarChart = ({ data, keys, colors, unit, stackId }: any) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E0EC" />
      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#49454F' }} dy={10} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#49454F' }} unit={unit ? ` ${unit}` : ''} />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#E8DEF8', opacity: 0.4 }} />
      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
      {keys.map((key: string, index: number) => (
        <Bar key={key} dataKey={key} fill={colors[index]} stackId={stackId} radius={[4, 4, 0, 0]} barSize={20} />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

// --- 4. INPUT TABLE COMPONENT ---
const InputContentTable = () => (
  <div className="bg-[#FEF7FF] border border-[#CAC4D0] rounded-[24px] p-6 shadow-sm animate-in fade-in zoom-in-95 duration-300">
    <div className="flex justify-between items-center mb-6 border-b border-[#E7E0EC] pb-4">
      <h3 className="text-lg font-bold text-[#1D1B20]">Input Content Log</h3>
      <button className="flex items-center gap-2 bg-[#6750A4] text-white px-6 py-2.5 rounded-[12px] text-sm font-medium hover:bg-[#523E85] transition-all shadow-sm active:scale-95">
        <Save size={18} /> Simpan Data
      </button>
    </div>

    <div className="overflow-x-auto rounded-[16px] border border-[#E7E0EC]">
      <table className="w-full text-sm text-center">
        <thead className="bg-[#F3EDF7] text-[#49454F]">
          <tr>
            <th className="px-4 py-3 font-bold text-left min-w-[180px] border-b border-r border-[#E7E0EC] sticky left-0 bg-[#F3EDF7] z-10">
              Video & Audio
            </th>
            {timeSlots.map((time) => (
              <th key={time} className="px-3 py-3 font-bold border-b border-r border-[#E7E0EC] min-w-[80px]">
                {time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E7E0EC]">
          {inputChannels.map((channel, idx) => (
            <tr key={idx} className="group hover:bg-[#F3EDF7]/50 transition-colors">
              <td className="px-4 py-3 text-left font-medium text-[#1D1B20] border-r border-[#E7E0EC] sticky left-0 bg-[#FEF7FF] group-hover:bg-[#F3EDF7]/50 z-10 flex items-center gap-2">
                <Tv size={16} className="text-[#6750A4]" /> {channel}
              </td>
              {timeSlots.map((time, tIdx) => {
                // Dummy logic for display: 02:00, 08:00, 10:00 = "Normal", others "-"
                const val = (time === '02:00' || time === '08:00' || time === '10:00') ? 'Normal' : '-';
                return (
                  <td key={tIdx} className="px-1 py-1 border-r border-[#E7E0EC]">
                    <div className={`py-2 px-1 rounded-md text-xs font-medium cursor-pointer transition-all
                      ${val === 'Normal' ? 'bg-[#E8DEF8] text-[#1D192B] border border-[#E8DEF8] hover:border-[#6750A4]' : 'text-[#79747E] hover:bg-gray-100'}`}>
                      {val}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- 5. MAIN PAGE ---
export default function MonitoringTxDigitalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const query = resolvedSearchParams.q || '';

  // STATE: Controls View Mode ('charts' vs 'input')
  const [viewMode, setViewMode] = useState<'charts' | 'input'>('charts');

  return (
    <div className="min-h-screen bg-[#FDFCFF] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#FEF7FF] p-4 rounded-[24px] border border-[#CAC4D0] shadow-sm">
          
          {/* Kiri: Title & Filter */}
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-normal text-[#1D1B20]">
              Grafik Metering NEC 10,9KW (Digital) <span className="font-bold text-[#6750A4]">Site Surabaya</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="relative">
                <select className="pl-3 pr-8 py-2.5 bg-white border border-[#79747E] rounded-[12px] text-sm text-[#49454F] outline-none focus:border-[#6750A4]">
                  <option>Today</option>
                  <option>Yesterday</option>
                </select>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="date" 
                  className="pl-3 pr-3 py-2.5 bg-white border border-[#79747E] rounded-[12px] text-sm text-[#49454F] outline-none focus:border-[#6750A4]"
                  defaultValue="2026-02-11"
                />
              </div>
              {/* Tombol Check (Kembali ke Grafik) */}
              <button 
                onClick={() => setViewMode('charts')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-sm font-medium transition-all shadow-sm active:scale-95
                  ${viewMode === 'charts' 
                    ? 'bg-[#6750A4] text-white hover:bg-[#523E85]' 
                    : 'bg-[#E8DEF8] text-[#1D1B20] hover:bg-[#E2D3F5]'}`}
              >
                <Eye size={18} /> Check
              </button>
            </div>
          </div>

          {/* Kanan: Action Buttons */}
          <div className="flex items-center gap-3 self-end lg:self-center">
            {/* Tombol Input Content (Masuk ke Tabel) */}
            <button 
              onClick={() => setViewMode('input')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-sm font-medium transition-all shadow-sm active:scale-95
                ${viewMode === 'input' 
                  ? 'bg-[#00C853] text-white ring-2 ring-offset-2 ring-[#00C853]' // Active state styling
                  : 'bg-[#00C853] text-white hover:bg-[#009624]'}`}
            >
              <Edit size={18} /> Input Content
            </button>
            
            <button className="flex items-center gap-2 bg-[#D32F2F] text-white px-5 py-2.5 rounded-[12px] text-sm font-medium hover:bg-[#B71C1C] transition-all shadow-sm active:scale-95">
              <History size={18} /> History
            </button>
          </div>
        </div>

        {/* CONTENT AREA (CONDITIONAL RENDERING) */}
        <div className="min-h-[500px]">
          {viewMode === 'charts' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Main Power"><ReusableAreaChart data={timeSeriesData} dataKey="power" color="#00C853" unit="kW" yDomain={[0, 10]}/></ChartCard>
              <ChartCard title="Temperature"><ReusableBarChart data={timeSeriesData} dataKey="temp" color="#448AFF" unit="°C"/></ChartCard>
              <ChartCard title="Power Exciter A"><ReusableAreaChart data={timeSeriesData} dataKey="power" color="#00C853" unit="%" yDomain={[0, 100]}/></ChartCard>
              <ChartCard title="Power Exciter B"><ReusableAreaChart data={timeSeriesData} dataKey="power" color="#00C853" unit="%" yDomain={[0, 100]}/></ChartCard>
              <ChartCard title="SNR & IM"><ReusableMultiBarChart data={timeSeriesData} keys={['snr', 'im']} colors={['#448AFF', '#00C853']} unit="dB"/></ChartCard>
              <ChartCard title="Pressure"><ReusableBarChart data={timeSeriesData} dataKey="press" color="#448AFF" unit="L/min"/></ChartCard>
              <ChartCard title="Forward Power HPA1-HPA3"><ReusableMultiBarChart data={timeSeriesData} keys={['hpa1', 'hpa2', 'hpa3']} colors={['#448AFF', '#00C853', '#FFC107']} unit="W"/></ChartCard>
              <ChartCard title="Reflect Power HPA1-HPA3"><ReusableAreaChart data={timeSeriesData} dataKey="power" color="#D32F2F" unit="W" yDomain={[0, 100]}/></ChartCard>
              <ChartCard title="Forward Power HPA4-HPA6"><ReusableMultiBarChart data={timeSeriesData} keys={['hpa1', 'hpa2', 'hpa3']} colors={['#448AFF', '#00C853', '#FFC107']} unit="W"/></ChartCard>
              <ChartCard title="Reflect Power HPA4-HPA6"><ReusableAreaChart data={timeSeriesData} dataKey="power" color="#D32F2F" unit="W" yDomain={[0, 100]}/></ChartCard>
            </div>
          ) : (
            // Render Table Component
            <InputContentTable />
          )}
        </div>

      </div>
    </div>
  );
}
