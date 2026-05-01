'use client';

import React, { useEffect, useState } from 'react';
import { DatePicker, Button, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { axiosInstance } from '@/lib/axiosApi/axiosInstance';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { CalendarOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

// ── types ─────────────────────────────────────────────────────────────────────
interface Stats {
  totalStudents: number;
  totalCourses: number;
  totalCertificates: number;
  totalMarksheets: number;
  totalRevenue: number;
}

interface DailyPoint { date: string; students: number; revenue: number; }

// ── stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon, label, value, color, bg,
}: { icon: React.ReactNode; label: string; value: string | number; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm border border-gray-100
                    hover:shadow-md transition-shadow duration-200">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
        <span className={`text-xl ${color}`}>{icon}</span>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// ── custom tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ── main dashboard ────────────────────────────────────────────────────────────
export default function CMSDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0, totalCourses: 0,
    totalCertificates: 0, totalMarksheets: 0, totalRevenue: 0,
  });
  const [chartData, setChartData] = useState<DailyPoint[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Date filter state
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [activeRange, setActiveRange] = useState<{ start?: string; end?: string }>({});

  const fetchData = async (start?: string, end?: string) => {
    setLoading(true);
    const params = { startDate: start, endDate: end };
    try {
      const [statsRes, chartRes] = await Promise.all([
        axiosInstance.get('dashboard/stats', { params }),
        axiosInstance.get('dashboard/chart', { params }),
      ]);
      setStats(statsRes.data);
      setChartData(chartRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyFilter = () => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].format('YYYY-MM-DD');
      const end = dateRange[1].format('YYYY-MM-DD');
      setActiveRange({ start, end });
      fetchData(start, end);
    }
  };

  const handleClearFilter = () => {
    setDateRange(null);
    setActiveRange({});
    fetchData();
  };

  const cards = [
    { icon: '👥', label: 'Total Students', value: stats.totalStudents, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: '📚', label: 'Total Courses', value: stats.totalCourses, color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: '🎓', label: 'Certificates Issued', value: stats.totalCertificates, color: 'text-green-600', bg: 'bg-green-50' },
    { icon: '📋', label: 'Marksheets Issued', value: stats.totalMarksheets, color: 'text-orange-600', bg: 'bg-orange-50' },
    {
      icon: '₹', label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      color: 'text-emerald-600', bg: 'bg-emerald-50'
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">SST Computer & Well Knowledge Institute — Overview</p>
        </div>

        {/* Date Filter */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-3">
          <RangePicker
            value={dateRange}
            onChange={(val) => setDateRange(val as any)}
            className="border-gray-200 hover:border-blue-400 focus:border-blue-400"
            style={{ borderRadius: '8px' }}
          />
          <Space>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={handleApplyFilter}
              className="bg-blue-600 hover:bg-blue-700"
              style={{ borderRadius: '8px' }}
            >
              Apply
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleClearFilter}
              style={{ borderRadius: '8px' }}
            >
              Clear
            </Button>
          </Space>
        </div>
      </div>

      {activeRange.start && (
        <div className="mb-6">
          <Tag color="blue" icon={<CalendarOutlined />} className="px-4 py-1.5 rounded-full text-sm font-medium border-blue-100 shadow-sm">
            Showing data from <span className="font-bold">{dayjs(activeRange.start).format('DD/MM/YYYY')}</span> to <span className="font-bold">{dayjs(activeRange.end).format('DD/MM/YYYY')}</span>
          </Tag>
        </div>
      )}

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-32 animate-pulse border border-gray-100">
              <div className="w-11 h-11 rounded-xl bg-gray-100 mb-3" />
              <div className="h-3 w-20 bg-gray-100 rounded mb-2" />
              <div className="h-6 w-14 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {cards.map((c, i) => <StatCard key={i} {...c} />)}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Student Statistics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Student Statistics</h2>
              <p className="text-xs text-gray-500 mt-0.5">Daily new enrollments — last 30 days</p>
            </div>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Students</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="students" name="Students" stroke="#3b82f6"
                strokeWidth={2.5} fill="url(#studentGrad)" dot={false} activeDot={{ r: 5, fill: '#3b82f6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Revenue Analytics</h2>
              <p className="text-xs text-gray-500 mt-0.5">Daily fee collection — last 30 days</p>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">Revenue</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false}
                tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#10b981"
                strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
