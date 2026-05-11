'use client';

import { useState } from 'react';
import { Plus, Shield, Edit2, Trash2, Eye, EyeOff, CheckCircle2, XCircle, UserCog } from 'lucide-react';

const STAFF: any[] = [];

const ROLES = [
  { name: 'Super Admin', color: 'text-red-600 bg-red-50 border-red-200', desc: 'Full access to all features' },
  { name: 'Manager', color: 'text-blue-600 bg-blue-50 border-blue-200', desc: 'Manage orders, products, customers' },
  { name: 'Order Fulfillment', color: 'text-cyan-600 bg-cyan-50 border-cyan-200', desc: 'Process and fulfill orders only' },
  { name: 'Customer Support', color: 'text-violet-600 bg-violet-50 border-violet-200', desc: 'Handle tickets and returns' },
  { name: 'Marketing', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', desc: 'Campaigns, discounts, analytics' },
];

const roleColor: Record<string, string> = {
  'Super Admin': 'text-red-600 bg-red-50 border-red-200',
  'Manager': 'text-blue-600 bg-blue-50 border-blue-200',
  'Order Fulfillment': 'text-cyan-600 bg-cyan-50 border-cyan-200',
  'Customer Support': 'text-violet-600 bg-violet-50 border-violet-200',
  'Marketing': 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

const PERMISSIONS = ['orders', 'products', 'inventory', 'customers', 'payments', 'analytics', 'discounts', 'reviews', 'marketing', 'support', 'returns', 'staff', 'settings'];

export default function StaffPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState({ name: '', email: '', role: 'Order Fulfillment' });

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Staff & Roles</h1>
          <p className="text-slate-500 text-sm mt-0.5">{STAFF.length} team members · {STAFF.filter(s => s.status === 'Active').length} active</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 text-xs font-bold bg-blue-600 text-white rounded-xl px-4 py-2.5 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <Plus className="w-3.5 h-3.5" /> Invite Member
        </button>
      </div>

      {/* Role overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES.map(role => (
          <div key={role.name} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role.color} shadow-sm`}>
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{role.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{role.desc}</p>
            </div>
            <span className="text-xs font-bold text-slate-900 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1">{STAFF.filter(s => s.role === role.name).length}</span>
          </div>
        ))}
      </div>

      {/* Staff list */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Team Members</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {STAFF.map((member, i) => (
            <div key={i} className="px-6 py-5 hover:bg-slate-50/80 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-lg shadow-slate-900/10">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-slate-900">{member.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleColor[member.role]}`}>{member.role}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>{member.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{member.email} · <span className="text-slate-400">Last login:</span> {member.lastLogin}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><Edit2 className="w-3.5 h-3.5" /></button>
                  {member.role !== 'Super Admin' && (
                    <button className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permission matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">Permission Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Module</th>
                {ROLES.map(r => (
                  <th key={r.name} className="text-center px-3 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold whitespace-nowrap">{r.name.split(' ')[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PERMISSIONS.map(perm => (
                <tr key={perm} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3"><p className="text-xs text-slate-900 font-bold uppercase tracking-tight">{perm}</p></td>
                  <td className="px-3 py-3 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  <td className="px-3 py-3 text-center">{['orders', 'products', 'customers', 'inventory'].includes(perm) ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-200 mx-auto" />}</td>
                  <td className="px-3 py-3 text-center">{['orders', 'inventory'].includes(perm) ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-200 mx-auto" />}</td>
                  <td className="px-3 py-3 text-center">{['customers', 'support', 'returns'].includes(perm) ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-200 mx-auto" />}</td>
                  <td className="px-3 py-3 text-center">{['marketing', 'analytics', 'discounts'].includes(perm) ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-200 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowInvite(false)}>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-slate-900 font-bold text-lg mb-5">Invite Team Member</h2>
            <div className="space-y-4">
              <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label><input value={invite.name} onChange={e => setInvite({ ...invite, name: e.target.value })} placeholder="e.g. Sara Ahmed" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500/50" /></div>
              <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label><input value={invite.email} onChange={e => setInvite({ ...invite, email: e.target.value })} placeholder="name@lensvik.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500/50" /></div>
              <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Role</label>
                <select value={invite.role} onChange={e => setInvite({ ...invite, role: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-slate-900 outline-none appearance-none">
                  {ROLES.filter(r => r.name !== 'Super Admin').map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowInvite(false)} className="flex-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl py-3 text-sm font-bold hover:bg-slate-200 transition-all">Cancel</button>
                <button className="flex-1 bg-blue-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">Send Invite</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
