'use client';

import { useState } from 'react';
import { Plug, CheckCircle2, XCircle, ExternalLink, Zap, RefreshCw, Settings } from 'lucide-react';

interface IntegrationItem {
  name: string;
  desc: string;
  status: 'Connected' | 'Disconnected';
  logo: string;
  color: string;
  config: Record<string, string | number> | null;
}

interface IntegrationGroup {
  group: string;
  items: IntegrationItem[];
}

const INTEGRATIONS: IntegrationGroup[] = [
  {
    group: 'Payments',
    items: [
      { name: 'JazzCash', desc: 'Mobile wallet & online payment gateway', status: 'Disconnected', logo: '💳', color: 'from-red-500 to-red-700', config: null },
      { name: 'EasyPaisa', desc: 'Telenor digital payment platform', status: 'Disconnected', logo: '💚', color: 'from-green-500 to-green-700', config: null },
      { name: 'Stripe', desc: 'International card payment processor', status: 'Disconnected', logo: '🔵', color: 'from-violet-500 to-violet-700', config: null },
      { name: 'PayPak', desc: 'Pakistan domestic payment network', status: 'Disconnected', logo: '🏦', color: 'from-blue-500 to-blue-700', config: null },
    ],
  },
  {
    group: 'Shipping & Logistics',
    items: [
      { name: 'TCS Courier', desc: 'Nationwide courier & express delivery', status: 'Disconnected', logo: '🚚', color: 'from-orange-500 to-orange-700', config: null },
      { name: 'Leopards Courier', desc: 'Door-to-door parcel delivery', status: 'Disconnected', logo: '🐆', color: 'from-yellow-500 to-amber-600', config: null },
      { name: 'M&P Express', desc: 'Same-day express delivery service', status: 'Disconnected', logo: '⚡', color: 'from-blue-600 to-indigo-600', config: null },
      { name: 'Rider', desc: 'Tech-enabled last-mile delivery', status: 'Disconnected', logo: '🛵', color: 'from-teal-500 to-cyan-600', config: null },
    ],
  },
  {
    group: 'Marketing & Analytics',
    items: [
      { name: 'Google Analytics 4', desc: 'Web traffic & conversion tracking', status: 'Disconnected', logo: '📊', color: 'from-blue-500 to-cyan-500', config: null },
      { name: 'Meta Pixel', desc: 'Facebook & Instagram ad tracking', status: 'Disconnected', logo: '📘', color: 'from-blue-600 to-indigo-500', config: null },
      { name: 'Mailchimp', desc: 'Email marketing automation', status: 'Disconnected', logo: '🐵', color: 'from-amber-500 to-yellow-500', config: null },
      { name: 'Klaviyo', desc: 'Ecommerce email & SMS platform', status: 'Disconnected', logo: '📩', color: 'from-emerald-500 to-teal-500', config: null },
    ],
  },
  {
    group: 'Support & Communication',
    items: [
      { name: 'WhatsApp Business API', desc: 'Customer messaging & order updates', status: 'Disconnected', logo: '💬', color: 'from-emerald-500 to-green-600', config: null },
      { name: 'Intercom', desc: 'Live chat & customer support platform', status: 'Disconnected', logo: '🗨️', color: 'from-blue-500 to-indigo-600', config: null },
      { name: 'Zendesk', desc: 'Help desk & ticketing system', status: 'Disconnected', logo: '🎫', color: 'from-slate-500 to-slate-700', config: null },
    ],
  },
  {
    group: 'Eyewear Technology',
    items: [
      { name: 'Virtual Try-On (Mediapipe)', desc: 'AI-powered face tracking try-on', status: 'Disconnected', logo: '👓', color: 'from-violet-500 to-purple-600', config: null },
      { name: 'Prescription OCR', desc: 'Auto-read prescription via camera', status: 'Disconnected', logo: '🔬', color: 'from-cyan-500 to-blue-500', config: null },
      { name: '3D Frame Viewer', desc: 'Interactive 3D product visualization', status: 'Disconnected', logo: '🕶️', color: 'from-indigo-500 to-violet-600', config: null },
    ],
  },
];

export default function IntegrationsPage() {
  const [configModal, setConfigModal] = useState<{ name: string; config: Record<string, string | number> | null } | null>(null);

  const connected = INTEGRATIONS.flatMap(g => g.items).filter(i => i.status === 'Connected').length;
  const total = INTEGRATIONS.flatMap(g => g.items).length;

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Integrations</h1>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">{connected} of {total} integrations active</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(connected / total) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-900 font-bold">{Math.round((connected / total) * 100)}%</span>
        </div>
      </div>

      {INTEGRATIONS.map(group => (
        <div key={group.group} className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">{group.group}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {group.items.map((item, i) => (
              <div key={i} className={`bg-white border rounded-2xl overflow-hidden transition-all hover:border-slate-300 shadow-sm ${item.status === 'Connected' ? 'border-slate-200' : 'border-slate-100 opacity-80 hover:opacity-100'}`}>
                <div className={`h-1 bg-gradient-to-r ${item.color}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-2xl drop-shadow-sm">{item.logo}</div>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.status === 'Connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {item.status === 'Connected' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">{item.name}</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed mb-4 font-medium">{item.desc}</p>

                  {item.config && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-3">
                      {Object.entries(item.config).slice(0, 2).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-[10px]">
                          <span className="text-slate-500 capitalize">{k}:</span>
                          <span className="text-slate-900 font-mono font-medium">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {item.status === 'Connected' ? (
                      <>
                        <button
                          onClick={() => setConfigModal({ name: item.name, config: item.config as Record<string, any> | null })}
                          className="flex-1 flex items-center justify-center gap-1 text-[10px] text-slate-600 border border-slate-200 rounded-lg py-1.5 hover:bg-slate-50 transition-all font-bold shadow-sm"
                        >
                          <Settings className="w-3 h-3" /> Configure
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 text-slate-400 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <button className={`flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold text-white bg-blue-600 rounded-lg py-1.5 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10`}>
                        <Zap className="w-3 h-3" /> Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* API Logs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-4">
          <h3 className="text-sm font-bold text-slate-900">Recent API Activity</h3>
          <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1.5 font-bold"><ExternalLink className="w-3 h-3" /> View Full Logs</button>
        </div>
        <div className="space-y-2 font-mono text-[11px]">
            <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">No API activity recorded</div>

        </div>
      </div>

      {/* Config modal */}
      {configModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfigModal(null)}>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-900 font-bold">{configModal.name} Settings</h2>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 font-bold">Connected</span>
            </div>
            {configModal.config && (
              <div className="space-y-3 mb-5">
                {Object.entries(configModal.config).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input defaultValue={String(value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500/50 font-mono" />
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setConfigModal(null)} className="flex-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl py-2.5 text-sm font-semibold hover:bg-slate-200 transition-colors">Cancel</button>
              <button className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">Save Config</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
