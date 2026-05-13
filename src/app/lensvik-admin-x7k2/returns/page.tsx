'use client';

import { useState, useEffect } from 'react';
import { RefreshCcw, Search, CheckCircle2, XCircle, Clock, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const statusStyle: Record<string, string> = {
  'Pending Review': 'bg-amber-50 text-amber-600 border-amber-200',
  'Item Received': 'bg-blue-50 text-blue-600 border-blue-200',
  'Refund Approved': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Rejected': 'bg-red-50 text-red-600 border-red-200',
  'Refund Processed': 'bg-violet-50 text-violet-600 border-violet-200',
};

const statusIcon: Record<string, React.ElementType> = {
  'Pending Review': Clock,
  'Item Received': RefreshCcw,
  'Refund Approved': CheckCircle2,
  'Rejected': XCircle,
};

export default function ReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const orders = await res.json();
      
      const retData = orders
        .filter((o: any) => o.status === 'Returned' || o.status === 'Cancelled' || o.status === 'Refunded')
        .map((o: any) => ({
          id: `RET-${o._id.substring(o._id.length - 6).toUpperCase()}`,
          order: o._id.substring(0, 8).toUpperCase(),
          customer: o.customerName,
          amount: o.totalAmount || 0,
          status: o.status === 'Returned' ? 'Pending Review' : (o.status === 'Refunded' ? 'Refund Processed' : 'Rejected'),
          type: o.status === 'Cancelled' ? 'Cancellation' : 'Return',
          reason: o.notes || 'No reason provided',
          date: new Date(o.createdAt).toLocaleDateString(),
          product: o.items?.[0]?.name || 'Product Details Not Found',
          refundMethod: o.paymentMethod || 'Original Method'
        }));
      
      setReturns(retData);
    } catch (error) {
      toast.error('Failed to load returns');
    } finally {
      setLoading(false);
    }
  };

  const filtered = returns.filter(r => {
    const m = r.customer.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || r.order.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'All' || r.status === filter;
    return m && mf;
  });

  const pending = returns.filter(r => r.status === 'Pending Review').length;
  const totalRefunds = returns.filter(r => r.status === 'Refund Approved' || r.status === 'Refund Processed').reduce((a, r) => a + r.amount, 0);


  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Returns & Refunds</h1>
          <p className="text-slate-500 text-sm mt-0.5">{returns.length} requests · {pending} pending review</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: pending, color: 'text-amber-600', bg: 'bg-white' },
          { label: 'Total Returns', value: returns.length, color: 'text-blue-600', bg: 'bg-white' },
          { label: 'Refunds Processed', value: `PKR ${(totalRefunds / 1000).toFixed(0)}K`, color: 'text-emerald-600', bg: 'bg-white' },
          { label: 'Rejected', value: returns.filter(r => r.status === 'Rejected').length, color: 'text-red-600', bg: 'bg-white' },
        ].map(card => (
          <div key={card.label} className={`${card.bg} border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">{card.label}</p>
          </div>
        ))}
      </div>


      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-9 flex-1 min-w-48 focus-within:border-blue-500/50 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search returns..." className="bg-transparent text-sm text-slate-900 placeholder-slate-500 outline-none flex-1" />
        </div>
        {['All', 'Pending Review', 'Item Received', 'Refund Approved', 'Rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`text-xs px-4 py-2 rounded-xl border transition-all whitespace-nowrap font-bold ${filter === f ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((ret, i) => {
          const StatusIcon = statusIcon[ret.status] || AlertCircle;
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-200 transition-all shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-400">{ret.id}</span>
                    <span className="text-xs font-bold text-blue-600">{ret.order}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ret.type === 'Return' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-violet-50 text-violet-600 border-violet-200'}`}>{ret.type}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-2">{ret.product}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <p className="text-xs text-slate-500 font-medium"><span className="text-slate-400 font-normal">Customer: </span>{ret.customer}</p>
                    <p className="text-xs text-slate-500 font-medium"><span className="text-slate-400 font-normal">Reason: </span>{ret.reason}</p>
                    <p className="text-xs text-slate-500 font-medium"><span className="text-slate-400 font-normal">Via: </span>{ret.refundMethod}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">PKR {ret.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{ret.date}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${statusStyle[ret.status]}`}>
                    <StatusIcon className="w-2.5 h-2.5" />{ret.status}
                  </span>
                </div>
              </div>
              {ret.status === 'Pending Review' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button className="flex-1 bg-emerald-600 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10">Approve Refund</button>
                  <button className="flex-1 bg-white text-red-600 border border-red-100 rounded-xl py-2.5 text-xs font-bold hover:bg-red-50 transition-all">Reject Request</button>
                  <button className="flex items-center gap-1.5 text-xs text-slate-600 font-bold border border-slate-200 rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-all"><Eye className="w-3.5 h-3.5" /> Details</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
