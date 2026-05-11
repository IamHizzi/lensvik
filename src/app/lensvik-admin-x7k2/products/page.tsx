'use client';

import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, MoreVertical, Package, Filter, Download, Upload, Star, Tag, Archive, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const PRODUCTS: any[] = [];

const CATEGORIES = ['All', 'Sunglasses', 'Eyeglasses', 'Prescription', 'Blue Light', 'Luxury', 'Accessories'];

const statusStyle: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Draft: 'bg-amber-50 text-amber-600 border-amber-200',
  'Out of Stock': 'bg-red-50 text-red-600 border-red-200',
  Archived: 'bg-slate-50 text-slate-500 border-slate-200',
};

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'table'>('table');

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const stockAlerts = PRODUCTS.filter(p => p.stock <= 10).length;

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">0 total products</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-xs text-slate-400 border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-100 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Bulk Import
          </button>
          <button className="flex items-center gap-2 text-xs text-slate-400 border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-100 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <Link
            href="/lensvik-admin-x7k2/products/add"
            className="flex items-center gap-2 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-4 py-2 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex-shrink-0 text-xs font-medium px-3 py-2 rounded-xl border transition-all ${category === c ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-white'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-9 flex-1 min-w-48 focus-within:border-blue-500/50 transition-colors">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="bg-transparent text-sm text-slate-900 placeholder-slate-500 outline-none flex-1"
            />
          </div>
          <button className="flex items-center gap-2 text-xs text-slate-600 border border-slate-200 rounded-xl px-3 h-9 hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filters <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Product</th>
                <th className="text-left px-4 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold hidden sm:table-cell">SKU</th>
                <th className="text-left px-4 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Price</th>
                <th className="text-left px-4 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Stock</th>
                <th className="text-left px-4 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold hidden lg:table-cell">Rating</th>
                <th className="text-left px-4 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Status</th>
                <th className="text-left px-4 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((product, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{product.name}</p>
                        <p className="text-[10px] text-slate-500">{product.variants} variants · {product.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <p className="text-[10px] font-mono text-slate-500">{product.sku}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-[10px] text-slate-400 bg-white/5 border border-white/8 rounded-full px-2 py-1">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-xs font-bold text-slate-900">PKR {product.price.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold ${product.stock === 0 ? 'text-red-400' : product.stock <= 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {product.stock === 0 ? 'Out' : product.stock}
                    </span>
                    {product.stock > 0 && product.stock <= 10 && (
                      <p className="text-[9px] text-amber-400/70">Low stock</p>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    {product.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-slate-300">{product.rating}</span>
                        <span className="text-[10px] text-slate-600">({product.reviews})</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600">No reviews</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${statusStyle[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
