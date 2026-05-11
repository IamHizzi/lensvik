'use client';

import { useState } from 'react';
import { Search, Clock, CheckCircle2, AlertCircle, MessageSquare, Phone, Mail, Eye } from 'lucide-react';

const TICKETS: any[] = [];

const priorityStyle: Record<string, string> = {
  High: 'bg-red-50 text-red-600 border-red-200',
  Medium: 'bg-amber-50 text-amber-600 border-amber-200',
  Low: 'bg-slate-50 text-slate-500 border-slate-200',
};

const statusStyle: Record<string, string> = {
  Open: 'bg-blue-50 text-blue-600 border-blue-200',
  'In Progress': 'bg-purple-50 text-purple-600 border-purple-200',
  Resolved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Escalated: 'bg-red-50 text-red-600 border-red-200',
};

const channelIcon: Record<string, React.ElementType> = {
  Email: Mail,
  WhatsApp: Phone,
  'Live Chat': MessageSquare,
};

export default function SupportPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState<typeof TICKETS[0] | null>(null);

  const filtered = TICKETS.filter(t => {
    const m = t.customer.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    const ms = statusFilter === 'All' || t.status === statusFilter;
    return m && ms;
  });

  const open = TICKETS.filter(t => t.status === 'Open').length;
  const inProgress = TICKETS.filter(t => t.status === 'In Progress').length;
  const escalated = TICKETS.filter(t => t.status === 'Escalated').length;

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-slate-500 text-sm mt-0.5">0 total tickets</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Tickets', value: open, color: 'text-blue-600', bg: 'bg-white' },
          { label: 'In Progress', value: inProgress, color: 'text-purple-600', bg: 'bg-white' },
          { label: 'Escalated', value: 0, color: 'text-red-600', bg: 'bg-white' },
          { label: 'Resolved Today', value: 0, color: 'text-emerald-600', bg: 'bg-white' },
        ].map(card => (
          <div key={card.label} className={`${card.bg} border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 h-9 flex-1 min-w-48 focus-within:border-blue-500/50 transition-colors">
          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." className="bg-transparent text-sm text-slate-900 placeholder-slate-500 outline-none flex-1" />
        </div>
        {['All', 'Open', 'In Progress', 'Escalated', 'Resolved'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs px-4 py-2 rounded-xl border transition-all font-bold ${statusFilter === s ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>{s}</button>
        ))}
      </div>

      {/* Tickets */}
      <div className="space-y-4">
        {filtered.map((ticket, i) => {
          const ChannelIcon = channelIcon[ticket.channel] || MessageSquare;
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                    {ticket.customer[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-[10px] font-mono text-slate-400">{ticket.id}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityStyle[ticket.priority]}`}>{ticket.priority}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle[ticket.status]}`}>{ticket.status}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1">{ticket.subject}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                      <span className="text-slate-900 font-bold">{ticket.customer}</span>
                      {ticket.order && <span className="text-blue-600 font-bold">{ticket.order}</span>}
                      <span className="flex items-center gap-1"><ChannelIcon className="w-3 h-3" />{ticket.channel}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ticket.lastReply}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedTicket(ticket)} className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all flex-shrink-0 shadow-sm">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5 border-b border-slate-50 pb-4">
              <div>
                <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-tight">{selectedTicket.id}</p>
                <h2 className="text-slate-900 font-bold text-lg leading-tight">{selectedTicket.subject}</h2>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusStyle[selectedTicket.status]}`}>{selectedTicket.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Customer</p><p className="text-sm text-slate-900 font-bold">{selectedTicket.customer}</p><p className="text-[10px] text-slate-500 font-medium">{selectedTicket.email}</p></div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Channel</p><p className="text-sm text-slate-900 font-bold">{selectedTicket.channel}</p><p className="text-[10px] text-slate-500 font-medium">Created {selectedTicket.created}</p></div>
            </div>
            <textarea rows={3} placeholder="Type your reply..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500/50 resize-none mb-3" />
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 text-white rounded-xl py-3 text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">Send Reply</button>
              <button className="flex-1 bg-white text-emerald-600 border border-emerald-200 rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-sm"><CheckCircle2 className="w-3.5 h-3.5" />Mark Resolved</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
