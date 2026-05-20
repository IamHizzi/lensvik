'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, Download, Eye, Printer, ChevronDown,
  Clock, CheckCircle2, Truck, Package, XCircle, RefreshCcw, Glasses, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';


const STATUS_OPTIONS = ['All', 'Pending', 'Confirmed', 'Lens Processing', 'Ready to Ship', 'Shipped', 'Delivered', 'Returned', 'Cancelled'];

const statusStyle: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-600 border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
  'Lens Processing': 'bg-purple-50 text-purple-600 border-purple-200',
  'Ready to Ship': 'bg-cyan-50 text-cyan-600 border-cyan-200',
  Shipped: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  Delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Returned: 'bg-orange-50 text-orange-600 border-orange-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
  Processing: 'bg-violet-50 text-violet-600 border-violet-200',
};

const statusIcon: Record<string, React.ElementType> = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  'Lens Processing': Glasses,
  'Ready to Ship': Package,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Returned: RefreshCcw,
  Cancelled: XCircle,
  Processing: RefreshCcw,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${window.location.origin}/api/orders`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to fetch orders');
      }
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Fetch orders error:', error);
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success('Status updated');
      fetchOrders();
      if (selectedOrder?._id === id) setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredOrders = useMemo(() => {
    const searchLower = search.toLowerCase();
    return orders.filter(o => {
      const matchSearch = 
        o._id?.toLowerCase().includes(searchLower) || 
        o.customerName?.toLowerCase().includes(searchLower) || 
        o.customerPhone?.includes(searchLower) ||
        o.shippingAddress?.city?.toLowerCase().includes(searchLower);
      const matchStatus = statusFilter === 'All' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const statusCounts = useMemo(() => {
    return STATUS_OPTIONS.slice(1).reduce((acc, s) => {
      acc[s] = orders.filter(o => o.status === s).length;
      return acc;
    }, {} as Record<string, number>);
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  }, [orders]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-900">Loading orders...</p>
          <p className="text-sm text-slate-500 mt-2">Checking your database and fetching the latest order records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">{orders.length} total orders recorded</p>

        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-3.5 h-3.5" />
            Export Orders
          </button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${statusFilter === s ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white bg-white/50'}`}
          >
            {s}
            {s !== 'All' && statusCounts[s] > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${statusFilter === s ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {statusCounts[s]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: statusCounts['Pending'] || 0, color: 'text-amber-600', bg: 'bg-white' },
          { label: 'Confirmed', value: statusCounts['Confirmed'] || 0, color: 'text-blue-600', bg: 'bg-white' },
          { label: 'Shipped', value: statusCounts['Shipped'] || 0, color: 'text-indigo-600', bg: 'bg-white' },
          { label: 'Revenue', value: `PKR ${totalRevenue.toLocaleString()}`, color: 'text-emerald-600', bg: 'bg-white' },
        ].map(card => (
          <div key={card.label} className={`${card.bg} border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">{card.label}</p>
          </div>
        ))}
      </div>


      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 h-10 flex-1 min-w-48 focus-within:border-blue-500/50 transition-colors">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, customer name, phone or city..."
              className="bg-transparent text-sm text-slate-900 placeholder-slate-500 outline-none flex-1"
            />
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl px-4 h-10 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                {['Order ID', 'Customer', 'Product', 'Date', 'Amount', 'Payment', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-5 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map((order) => {
                const StatusIcon = statusIcon[order.status] || Clock;
                const firstItem = order.items?.[0];
                return (
                  <tr key={order._id || order.customerPhone || crypto.randomUUID()} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-xs font-bold text-blue-600 group-hover:underline cursor-pointer">{order._id}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{order.shippingAddress?.city || 'No City'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-xs text-slate-900 font-bold">{order.customerName}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-xs text-slate-800 font-bold max-w-[200px] truncate">
                          {firstItem?.name || 'Unknown Product'}
                          {order.items?.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {firstItem?.variant?.color} {firstItem?.variant?.size}
                        </p>
                        {firstItem?.prescription && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-1.5 py-0.5 mt-1 font-bold">
                            <Glasses className="w-2.5 h-2.5" />VERIFIED RX
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-slate-600 font-medium">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-slate-900 whitespace-nowrap">PKR {(order.totalAmount || 0).toLocaleString()}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{order.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${statusStyle[order.status]}`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-20 bg-slate-50/20">
              <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium tracking-tight">No orders found matching your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6 border-b border-slate-50 pb-4">
              <div>
                <h2 className="text-slate-900 font-bold text-xl">{selectedOrder._id}</h2>
                <p className="text-slate-500 text-xs font-medium mt-1">{new Date(selectedOrder.createdAt).toLocaleString()} · {selectedOrder.shippingAddress?.city}</p>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${statusStyle[selectedOrder.status]}`}>
                {selectedOrder.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Customer</p>
                <p className="text-slate-900 font-bold">{selectedOrder.customerName}</p>
                <p className="text-slate-500 text-xs font-medium">{selectedOrder.customerPhone}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Payment</p>
                <p className="text-slate-900 font-bold">{selectedOrder.paymentMethod}</p>
                <p className="text-emerald-600 text-xs font-bold">PKR {(selectedOrder.totalAmount || 0).toLocaleString()}</p>
              </div>
              <div className="col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-4 overflow-y-auto max-h-48">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Product Details</p>
                {selectedOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} className="mb-3 last:mb-0 border-b border-slate-100 pb-2 last:border-0">
                    <p className="text-slate-900 font-bold">{item.name}</p>
                    <p className="text-slate-500 text-xs font-medium">{item.variant?.color} {item.variant?.size} {item.variant?.lensType}</p>
                    {item.prescription && (
                      <div className="mt-2 flex items-center gap-1.5 text-violet-600 bg-violet-50 px-2 py-1 rounded-lg w-fit border border-violet-100 font-bold text-[10px]">
                        <Glasses className="w-3 h-3" /> VERIFIED PRESCRIPTION
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            
            {/* Order actions */}
            <div className="flex gap-3 pt-2">
              <select
                value={selectedOrder.status}
                onChange={e => handleUpdateStatus(selectedOrder._id, e.target.value)}
                className="flex-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl py-3 px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                {STATUS_OPTIONS.slice(1).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button className="flex-1 bg-white text-slate-600 border border-slate-200 rounded-xl py-3 text-xs font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
