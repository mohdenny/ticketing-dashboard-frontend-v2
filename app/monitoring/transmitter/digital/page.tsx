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
  MoreVertical,
  Calendar,
  Save,
  Tv,
  LayoutDashboard,
  Filter,
  RefreshCcw,
  CheckCircle2,
  TableProperties,
} from 'lucide-react';

// Dummy data
const timeSeriesData = [
  {
    time: '00:00',
    power: 0,
    temp: 28,
    snr: 35,
    im: -35,
    press: 45,
    hpa1: 0,
    hpa2: 0,
    hpa3: 0,
  },
  {
    time: '02:00',
    power: 8.2,
    temp: 42,
    snr: 35,
    im: -35,
    press: 45,
    hpa1: 1100,
    hpa2: 1050,
    hpa3: 1080,
  },
  {
    time: '04:00',
    power: 0,
    temp: 29,
    snr: 0,
    im: 0,
    press: 0,
    hpa1: 0,
    hpa2: 0,
    hpa3: 0,
  },
  {
    time: '06:00',
    power: 0,
    temp: 28,
    snr: 0,
    im: 0,
    press: 0,
    hpa1: 0,
    hpa2: 0,
    hpa3: 0,
  },
  {
    time: '08:00',
    power: 8.5,
    temp: 43,
    snr: 35,
    im: -35,
    press: 45,
    hpa1: 1120,
    hpa2: 1060,
    hpa3: 1090,
  },
  {
    time: '10:00',
    power: 8.1,
    temp: 41,
    snr: 35,
    im: -35,
    press: 45,
    hpa1: 1110,
    hpa2: 1055,
    hpa3: 1085,
  },
];

const inputChannels = [
  'BBS TV',
  'BN CHANNEL',
  'JAWA POS',
  'JTV',
  'MADU TV NUSANTARA',
  'MAGNA CHANNEL',
  'METRO TV HD',
  'TV9 NUSANTARA',
];
const timeSlots = [
  '00:00',
  '02:00',
  '04:00',
  '06:00',
  '08:00',
  '10:00',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
  '22:00',
];

// Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#F3EDF7]/95 backdrop-blur-sm border border-[#CAC4D0] p-3 rounded-[12px] shadow-lg text-xs z-50">
        <p className="font-bold text-[#1D1B20] mb-2 border-b border-[#CAC4D0]/50 pb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-[#49454F] font-medium min-w-[60px]">
                {entry.name}:
              </span>
              <span className="font-bold" style={{ color: entry.color }}>
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Reusable Chart Wrapper
const ChartCard = ({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="bg-[#FEF7FF] border border-[#CAC4D0] rounded-[24px] p-1 shadow-sm flex flex-col h-[350px] group hover:border-[#6750A4]/30 transition-colors duration-300">
    <div className="flex justify-between items-center px-5 pt-5 pb-2">
      <div className="flex items-center gap-2">
        {/* Decorative bar */}
        <div className="h-4 w-1 bg-[#6750A4] rounded-full"></div>
        <h3 className="text-sm font-bold text-[#1D1B20] tracking-wide">
          {title}
        </h3>
      </div>
      <button className="text-[#49454F] hover:bg-[#F3EDF7] p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100">
        <MoreVertical size={18} />
      </button>
    </div>
    <div className="flex-1 w-full min-h-0 px-2 pb-2">{children}</div>
  </div>
);

// Charts Logic
const ReusableAreaChart = ({ data, dataKey, color, unit, yDomain }: any) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      data={data}
      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
    >
      <defs>
        <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.15} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E0EC" />
      <XAxis
        dataKey="time"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10, fill: '#49454F' }}
        dy={10}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10, fill: '#49454F' }}
        unit={unit ? ` ${unit}` : ''}
        domain={yDomain || [0, 'auto']}
      />
      <Tooltip content={<CustomTooltip />} />
      <Area
        type="monotone"
        dataKey={dataKey}
        stroke={color}
        strokeWidth={2.5}
        fillOpacity={1}
        fill={`url(#color${dataKey})`}
        dot={{ r: 0, active: { r: 5, strokeWidth: 0 } }}
      />
    </AreaChart>
  </ResponsiveContainer>
);

const ReusableBarChart = ({ data, dataKey, color, unit }: any) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E0EC" />
      <XAxis
        dataKey="time"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10, fill: '#49454F' }}
        dy={10}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10, fill: '#49454F' }}
        unit={unit ? ` ${unit}` : ''}
      />
      <Tooltip
        content={<CustomTooltip />}
        cursor={{ fill: '#E8DEF8', opacity: 0.3, radius: 4 }}
      />
      <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} barSize={32} />
    </BarChart>
  </ResponsiveContainer>
);

const ReusableMultiBarChart = ({ data, keys, colors, unit, stackId }: any) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E0EC" />
      <XAxis
        dataKey="time"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10, fill: '#49454F' }}
        dy={10}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 10, fill: '#49454F' }}
        unit={unit ? ` ${unit}` : ''}
      />
      <Tooltip
        content={<CustomTooltip />}
        cursor={{ fill: '#E8DEF8', opacity: 0.3, radius: 4 }}
      />
      <Legend
        iconType="circle"
        wrapperStyle={{
          fontSize: '11px',
          paddingTop: '12px',
          color: '#49454F',
        }}
      />
      {keys.map((key: string, index: number) => (
        <Bar
          key={key}
          dataKey={key}
          fill={colors[index]}
          stackId={stackId}
          radius={index === keys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          barSize={24}
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

// Input Table Component
const InputContentTable = () => (
  <div className="bg-[#FEF7FF] border border-[#CAC4D0] rounded-[24px] overflow-hidden shadow-sm flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-[#E7E0EC]">
      <div>
        <h3 className="text-lg font-bold text-[#1D1B20]">Input Log Harian</h3>
        <p className="text-sm text-[#49454F]">
          Pantau kualitas sinyal input per jam
        </p>
      </div>
      <button className="flex items-center gap-2 bg-[#6750A4] text-white px-5 py-2.5 rounded-[12px] text-sm font-medium hover:bg-[#523E85] transition-all shadow-sm active:scale-95">
        <Save size={18} />
        <span>Simpan Perubahan</span>
      </button>
    </div>

    <div className="overflow-x-auto custom-scrollbar flex-1">
      <table className="w-full text-sm text-center border-collapse">
        <thead className="bg-[#F3EDF7] text-[#49454F] sticky top-0 z-20 shadow-sm">
          <tr>
            <th className="px-4 py-4 font-bold text-left min-w-[200px] border-b border-r border-[#E7E0EC] sticky left-0 bg-[#F3EDF7] z-30">
              Channel Name
            </th>
            {timeSlots.map((time) => (
              <th
                key={time}
                className="px-3 py-4 font-semibold border-b border-r border-[#E7E0EC] min-w-[90px] whitespace-nowrap"
              >
                {time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E7E0EC]">
          {inputChannels.map((channel, idx) => (
            <tr
              key={idx}
              className="group hover:bg-[#F3EDF7]/30 transition-colors"
            >
              <td className="px-4 py-3 text-left font-medium text-[#1D1B20] border-r border-[#E7E0EC] sticky left-0 bg-[#FEF7FF] group-hover:bg-[#F3EDF7] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#E8DEF8] rounded-lg text-[#6750A4]">
                    <Tv size={16} />
                  </div>
                  {channel}
                </div>
              </td>
              {timeSlots.map((time, tIdx) => {
                const isNormal =
                  time === '02:00' || time === '08:00' || time === '10:00';
                return (
                  <td
                    key={tIdx}
                    className="px-2 py-2 border-r border-[#E7E0EC]"
                  >
                    <button
                      className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border
                        ${
                          isNormal
                            ? 'bg-[#E8DEF8]/50 text-[#1D192B] border-[#CAC4D0] hover:bg-[#E8DEF8] hover:border-[#6750A4]'
                            : 'bg-transparent text-[#79747E] border-transparent hover:bg-gray-100 hover:border-[#E7E0EC]'
                        }`}
                    >
                      {isNormal ? (
                        <span className="flex items-center justify-center gap-1">
                          <CheckCircle2 size={12} className="text-[#6750A4]" />{' '}
                          Normal
                        </span>
                      ) : (
                        '-'
                      )}
                    </button>
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

// Main page
export default function MonitoringTxDigitalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const [viewMode, setViewMode] = useState<'charts' | 'input'>('charts');

  return (
    <div className="min-h-screen bg-[#FDFCFF] p-4 md:p-6 lg:p-8 font-sans text-[#1D1B20]">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Top bar, Title & Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-[#6750A4] bg-[#E8DEF8] w-fit px-3 py-1 rounded-full mb-2">
              <LayoutDashboard size={14} />
              <span>Monitoring Digital</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-[#1D1B20]">
              NEC 10,9KW{' '}
              <span className="font-bold text-[#6750A4]">Surabaya</span>
            </h1>
            <p className="text-[#49454F] text-sm md:text-base">
              Real-time status transmisi dan input content log.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* View Switcher/ Segemented button */}
            <div className="bg-[#E7E0EC] p-1 rounded-full flex items-center w-full sm:w-auto">
              <button
                onClick={() => setViewMode('charts')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${
                      viewMode === 'charts'
                        ? 'bg-[#6750A4] text-white shadow-md'
                        : 'text-[#49454F] hover:bg-[#1D1B20]/5'
                    }`}
              >
                <LayoutDashboard size={16} /> Monitoring
              </button>
              <button
                onClick={() => setViewMode('input')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                    ${
                      viewMode === 'input'
                        ? 'bg-[#6750A4] text-white shadow-md'
                        : 'text-[#49454F] hover:bg-[#1D1B20]/5'
                    }`}
              >
                <TableProperties size={16} /> Input Log
              </button>
            </div>

            {/* History Button */}
            <button
              className="p-3 rounded-full border border-[#79747E] text-[#49454F] hover:bg-[#F3EDF7] hover:text-[#1D1B20] hover:border-[#1D1B20] transition-colors"
              title="History Log"
            >
              <History size={20} />
            </button>
          </div>
        </div>

        {/* Controls bar, filters */}
        <div className="bg-[#FEF7FF] border border-[#CAC4D0] rounded-[20px] p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm sticky top-2 z-40 backdrop-blur-md bg-[#FEF7FF]/90">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-[#49454F] text-sm font-medium mr-2">
              <Filter size={16} /> Filter:
            </div>
            <div className="relative">
              <select className="appearance-none pl-4 pr-10 py-2.5 bg-[#F3EDF7] hover:bg-[#E8DEF8] rounded-[12px] text-sm font-medium text-[#1D1B20] border-none outline-none focus:ring-2 focus:ring-[#6750A4] cursor-pointer transition-colors">
                <option>Hari Ini</option>
                <option>Kemarin</option>
                <option>Minggu Ini</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#49454F]">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#49454F] group-focus-within:text-[#6750A4]">
                <Calendar size={16} />
              </div>
              <input
                type="date"
                defaultValue="2026-02-11"
                className="pl-10 pr-4 py-2.5 bg-[#F3EDF7] hover:bg-[#E8DEF8] rounded-[12px] text-sm font-medium text-[#1D1B20] outline-none focus:ring-2 focus:ring-[#6750A4] transition-colors"
              />
            </div>
          </div>

          <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-[#6750A4] hover:bg-[#E8DEF8] px-4 py-2.5 rounded-[12px] text-sm font-bold transition-colors">
            <RefreshCcw size={16} /> Refresh Data
          </button>
        </div>

        {/* Content area */}
        <div className="min-h-[600px] animate-in fade-in zoom-in-95 duration-500">
          {viewMode === 'charts' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
              {/* Baris 1, Key Metrics */}
              <div className="md:col-span-2 xl:col-span-2">
                <ChartCard title="Main Output Power">
                  <ReusableAreaChart
                    data={timeSeriesData}
                    dataKey="power"
                    color="#00C853"
                    unit="kW"
                    yDomain={[0, 10]}
                  />
                </ChartCard>
              </div>
              <ChartCard title="Temperature Rack">
                <ReusableBarChart
                  data={timeSeriesData}
                  dataKey="temp"
                  color="#B3261E"
                  unit="°C"
                />
              </ChartCard>

              {/* Baris 2, Exciters */}
              <ChartCard title="Exciter A Power">
                <ReusableAreaChart
                  data={timeSeriesData}
                  dataKey="power"
                  color="#6750A4"
                  unit="%"
                  yDomain={[0, 100]}
                />
              </ChartCard>
              <ChartCard title="Exciter B Power">
                <ReusableAreaChart
                  data={timeSeriesData}
                  dataKey="power"
                  color="#6750A4"
                  unit="%"
                  yDomain={[0, 100]}
                />
              </ChartCard>
              <ChartCard title="Signal Quality (SNR & IM)">
                <ReusableMultiBarChart
                  data={timeSeriesData}
                  keys={['snr', 'im']}
                  colors={['#2196F3', '#00C853']}
                  unit="dB"
                />
              </ChartCard>

              {/* Baris 3, HPA Forward */}
              <div className="md:col-span-2 xl:col-span-1">
                <ChartCard title="Fwd Power HPA 1-3">
                  <ReusableMultiBarChart
                    data={timeSeriesData}
                    keys={['hpa1', 'hpa2', 'hpa3']}
                    colors={['#2196F3', '#00C853', '#FFC107']}
                    unit="W"
                    stackId="a"
                  />
                </ChartCard>
              </div>
              <div className="md:col-span-2 xl:col-span-1">
                <ChartCard title="Fwd Power HPA 4-6">
                  <ReusableMultiBarChart
                    data={timeSeriesData}
                    keys={['hpa1', 'hpa2', 'hpa3']}
                    colors={['#2196F3', '#00C853', '#FFC107']}
                    unit="W"
                    stackId="b"
                  />
                </ChartCard>
              </div>

              {/* Baris 4, Pressure & Reflect */}
              <ChartCard title="Liquid Pressure">
                <ReusableBarChart
                  data={timeSeriesData}
                  dataKey="press"
                  color="#006391"
                  unit="L/min"
                />
              </ChartCard>
              <ChartCard title="Reflect Power Total">
                <ReusableAreaChart
                  data={timeSeriesData}
                  dataKey="power"
                  color="#B3261E"
                  unit="W"
                  yDomain={[0, 100]}
                />
              </ChartCard>
            </div>
          ) : (
            <InputContentTable />
          )}
        </div>
      </div>
    </div>
  );
}
