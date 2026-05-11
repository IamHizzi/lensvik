'use client';

import { useState } from 'react';
import { TrendingUp, Users, ShoppingBag, Eye, ArrowUpRight, BarChart3, Smartphone, Monitor, Tablet } from 'lucide-react';

const monthlyRevenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const topCategories: any[] = [];
const regionalData: any[] = [];
const funnelData: any[] = [];

function BarChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const max = Math.max(...data);
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex items-end gap-1.5 h-32 mt-4">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
          <div className="relative w-full">
            {hovered === i && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-white whitespace-nowrap z-10 shadow-xl">
                PKR {v}K
              </div>
            )}
            <div className={`w-full rounded-t-md transition-all duration-200 ${hovered === i ? 'opacity-100 shadow-lg' : 'opacity-70'}`} style={{ height: `${(v / max) * 120}px`, backgroundColor: color }} />
          </div>
          <p className="text-[9px] text-slate-500 font-bold">{labels[i]}</p>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');
  const totalRevenue = monthlyRevenue.reduce((a, v) => a + v * 1000, 0);

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">Performance overview · Lensvik.com</p>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {['7d', '30d', '90d', '1y'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`text-xs px-4 py-1.5 rounded-lg transition-all font-bold ${period === p ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `PKR 0.0M`, change: '+0%', up: true, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Orders', value: '0', change: '+0%', up: true, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Unique Visitors', value: '0', change: '+0%', up: true, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Conversion Rate', value: '0.0%', change: '+0.0%', up: true, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full font-bold">
                  <ArrowUpRight className="w-3 h-3" />{card.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 leading-tight">{card.value}</p>
              <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
          <h3 className="text-sm font-bold text-slate-900">Monthly Revenue (PKR '000)</h3>
          <span className="text-xs text-slate-500 font-medium">Full Year 2025</span>
        </div>
        <BarChart data={monthlyRevenue} labels={months} color="#2563eb" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category performance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 border-b border-slate-50 pb-4">Category Performance</h3>
          <div className="space-y-6">
            <div className="text-center py-20 text-slate-400 text-xs font-bold uppercase tracking-widest">No category data available</div>

          </div>
        </div>

        {/* Regional */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 border-b border-slate-50 pb-4">Regional Sales</h3>
          <div className="space-y-4">
            <div className="text-center py-20 text-slate-400 text-xs font-bold uppercase tracking-widest">No regional data available</div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion funnel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 border-b border-slate-50 pb-4">Conversion Funnel</h3>
          <div className="space-y-4">
            <div className="text-center py-20 text-slate-400 text-xs font-bold uppercase tracking-widest">Funnel tracking inactive</div>

          </div>
        </div>

        {/* Device breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 border-b border-slate-50 pb-4">Device Breakdown</h3>
          <div className="space-y-6">
            {[
              { device: 'Mobile', pct: 0, sessions: 0, icon: Smartphone, color: 'text-blue-600', bar: 'bg-blue-600' },
              { device: 'Desktop', pct: 0, sessions: 0, icon: Monitor, color: 'text-indigo-600', bar: 'bg-indigo-600' },
              { device: 'Tablet', pct: 0, sessions: 0, icon: Tablet, color: 'text-violet-600', bar: 'bg-violet-600' },
            ].map(d => {
              const Icon = d.icon;
              return (
                <div key={d.device} className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center ${d.color} shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs text-slate-900 font-bold uppercase tracking-tight">{d.device}</p>
                      <p className="text-xs font-bold text-slate-900">{d.pct}%</p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div className={`h-full ${d.bar} rounded-full transition-all duration-700`} style={{ width: `${d.pct}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-1.5 uppercase tracking-tighter">{d.sessions.toLocaleString()} sessions</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
