'use client';

import { useState } from 'react';
import { Search, AlertTriangle, Package, TrendingDown, RefreshCw, Filter } from 'lucide-react';

const INVENTORY: any[] = [];

function getStockStatus(stock: number, reorder: number) {
  if (stock === 0) return { label: 'Out of Stock', style: 'bg-red-50 text-red-600 border-red-200' };
  if (stock <= reorder) return { label: 'Low Stock', style: 'bg-amber-50 text-amber-600 border-amber-200' };
  return { label: 'In Stock', style: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
}

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = INVENTORY.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const status = getStockStatus(item.stock, item.reorderPoint);
    const matchFilter = filter === 'all' || (filter === 'low' && item.stock > 0 && item.stock <= item.reorderPoint) || (filter === 'out' && item.stock === 0) || (filter === 'ok' && item.stock > item.reorderPoint);
    return matchSearch && matchFilter;
  });

  const outOfStock = INVENTORY.filter(i => i.stock === 0).length;
  const lowStock = INVENTORY.filter(i => i.stock > 0 && i.stock <= i.reorderPoint).length;
  const totalValue = INVENTORY.reduce((acc, i) => acc + i.stock * i.cost, 0);

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-500 text-sm mt-0.5">{INVENTORY.length} SKUs tracked · Value: PKR {(totalValue / 1000000).toFixed(1)}M</p>
        </div>
        <button className="flex items-center gap-2 text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded-xl px-4 py-2.5 hover:bg-blue-100 transition-all shadow-sm">
          <RefreshCw className="w-3.5 h-3.5" /> Sync Stock
        </button>
      </div>

      {/* Alert cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total SKUs', value: INVENTORY.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Low Stock', value: lowStock, icon: TrendingDown, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Out of Stock', value: outOfStock, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Inventory Value', value: `PKR ${(totalValue / 1000000).toFixed(1)}M`, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg} shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 leading-tight">{card.value}</p>
              <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter + Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-9 flex-1 min-w-48 focus-within:border-blue-500/50 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SKU, product..." className="bg-transparent text-sm text-slate-900 placeholder-slate-500 outline-none flex-1" />
        </div>
        {['all', 'ok', 'low', 'out'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`text-xs px-4 py-2.5 rounded-xl border transition-all capitalize font-bold ${filter === f ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 bg-white/50'}`}>
            {f === 'all' ? 'All' : f === 'ok' ? 'In Stock' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['SKU', 'Product / Variant', 'Location', 'Stock', 'Reserved', 'Available', 'Reorder Point', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((item, i) => {
                const status = getStockStatus(item.stock, item.reorderPoint);
                return (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-[10px] font-mono text-slate-400">{item.sku}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-500">{item.variant}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5 font-medium">{item.location}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className={`text-sm font-bold ${item.stock === 0 ? 'text-red-600' : item.stock <= item.reorderPoint ? 'text-amber-600' : 'text-slate-900'}`}>{item.stock}</p>
                    </td>
                    <td className="px-5 py-4"><p className="text-xs text-slate-500">{item.reserved}</p></td>
                    <td className="px-5 py-4"><p className="text-xs font-bold text-emerald-600">{item.available}</p></td>
                    <td className="px-5 py-4"><p className="text-xs text-slate-500">{item.reorderPoint}</p></td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.style}`}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
