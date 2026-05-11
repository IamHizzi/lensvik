'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag, DollarSign, Users, Package,
  RefreshCcw, AlertTriangle, Eye, ArrowUpRight,
  Clock, CheckCircle2, Truck, XCircle, Zap, Activity,
  ChevronRight, MessageSquare, TrendingUp, Search
} from 'lucide-react';
import Link from 'next/link';

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ label, value, change, icon: Icon, trend, color, prefix = '' }: {
  label: string; value: string; change: string; icon: React.ElementType; trend: 'up' | 'down'; color: string; prefix?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all duration-200 group shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3 rotate-90" />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900">{prefix}{value}</h3>
      </div>
    </div>
  );
}

// ─── Revenue Chart ────────────────────────────────────────────────────────────
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const revenueData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const ordersData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function RevenueChart() {
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const max = Math.max(...revenueData) || 1;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-slate-900 font-semibold">Revenue Overview</h3>
          <p className="text-slate-500 text-xs">Monthly performance analysis</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />Revenue</span>
          <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />Orders</span>
        </div>
      </div>
      <div className="relative mt-8">
        <div className="flex items-end gap-2 h-48">
          {revenueData.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer" onMouseEnter={() => setActiveMonth(i)} onMouseLeave={() => setActiveMonth(null)}>
              <div className="relative w-full h-full flex items-end">
                {activeMonth === i && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-lg px-2.5 py-1.5 text-[10px] whitespace-nowrap z-10 shadow-xl">
                    <p className="font-bold">PKR {(v / 1000).toFixed(0)}k</p>
                    <p className="text-slate-400">{ordersData[i]} orders</p>
                  </div>
                )}
                <div
                  className={`w-full rounded-t-lg transition-all duration-200 ${activeMonth === i ? 'bg-blue-600' : 'bg-blue-600/20'}`}
                  style={{ height: `${(v / max) * 100}%`, minHeight: '4px' }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4 border-t border-slate-100 pt-2">
          {months.map((m, i) => (
            <p key={i} className="flex-1 text-center text-[10px] text-slate-400 font-medium">{m}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back to Lensvik Control Center.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-slate-600 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Last Sync: Just now
          </div>
          <button className="bg-blue-600 text-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <RefreshCcw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value="0.0M" change="+0%" icon={DollarSign} trend="up" color="bg-blue-50 text-blue-600" prefix="PKR " />
        <StatCard label="Orders Today" value="0" change="+0%" icon={ShoppingBag} trend="up" color="bg-indigo-50 text-indigo-600" />
        <StatCard label="Active Customers" value="0" change="+0%" icon={Users} trend="up" color="bg-violet-50 text-violet-600" />
        <StatCard label="Refund Requests" value="0" change="-0" icon={RefreshCcw} trend="down" color="bg-amber-50 text-amber-600" />
      </div>



      {/* Revenue chart + Live feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <h3 className="text-slate-900 font-semibold text-sm">Live Activity</h3>
          </div>
          <div className="text-center py-20">
            <Zap className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-medium">Monitoring activity...</p>
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-slate-900 font-semibold">Recent Orders</h3>
            <Link href="/lensvik-admin-x7k2/orders" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="text-center py-20 text-slate-400 text-xs">No orders to display</div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-slate-900 font-semibold text-sm">Top Products</h3>
            <Link href="/lensvik-admin-x7k2/products" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
              All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="text-center py-20 text-slate-400 text-xs">No product data</div>
        </div>
      </div>

      {/* Bottom widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment methods */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-900 font-semibold mb-5 text-sm">Payment Methods</h3>
          <div className="space-y-4">
            {[
              { label: 'JazzCash', pct: 0, color: 'bg-red-500' },
              { label: 'EasyPaisa', pct: 0, color: 'bg-emerald-500' },
              { label: 'COD', pct: 0, color: 'bg-amber-500' },
              { label: 'Card', pct: 0, color: 'bg-blue-600' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase tracking-widest text-slate-500">
                  <span>{item.label}</span>
                  <span className="text-slate-900">{item.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-900 font-semibold mb-5 text-sm">Traffic Sources</h3>
          <div className="space-y-4">
            {[
              { label: 'Instagram', pct: 0, color: 'bg-pink-500' },
              { label: 'Direct', pct: 0, color: 'bg-slate-400' },
              { label: 'Google Ads', pct: 0, color: 'bg-blue-500' },
              { label: 'Referral', pct: 0, color: 'bg-indigo-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase tracking-widest text-slate-500">
                  <span>{item.label}</span>
                  <span className="text-slate-900">{item.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-900 font-semibold mb-5 text-sm">Order Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Delivered', count: 0, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'In Transit', count: 0, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Processing', count: 0, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Pending', count: 0, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Cancelled', count: 0, color: 'text-red-600', bg: 'bg-red-50' },
            ].map(item => (
              <div key={item.label} className={`flex items-center justify-between px-3 py-2 rounded-xl ${item.bg}`}>
                <span className="text-xs font-medium text-slate-700">{item.label}</span>
                <span className={`text-xs font-bold ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
