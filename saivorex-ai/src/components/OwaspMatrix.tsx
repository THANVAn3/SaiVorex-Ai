import React, { useState } from 'react';
import { OWASP_TOP_10 } from '../data/presets';
import { OwaspItem } from '../types';
import { AlertTriangle, BookOpen, CheckCircle2, Code2, ArrowRight, X, Copy, Shield, Sparkles } from 'lucide-react';

export const OwaspMatrix: React.FC = () => {
  const [selectedOwasp, setSelectedOwasp] = useState<OwaspItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedVulnerable, setCopiedVulnerable] = useState(false);
  const [copiedSecure, setCopiedSecure] = useState(false);

  const filteredItems = OWASP_TOP_10.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">OWASP Top 10 Security Matrix</h2>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium">
              2021 Standard
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Comprehensive reference architecture for the 10 most critical web application security risks with code mitigation blueprints.
          </p>
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search OWASP category..."
            className="w-full bg-[#070a12] border border-slate-700/80 text-xs text-slate-200 px-4 py-3 rounded-2xl focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedOwasp(item)}
            className="bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 space-y-4 cursor-pointer transition-all duration-200 group relative overflow-hidden flex flex-col justify-between shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  {item.id}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {item.cweReferences.length} CWEs
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-mono font-bold">
              <span>View Code Blueprint</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {selectedOwasp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0b0f1d] border border-slate-800 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 border border-amber-800 px-2.5 py-0.5 rounded">
                    {selectedOwasp.id}
                  </span>
                  <h3 className="text-xl font-extrabold text-white">{selectedOwasp.name}</h3>
                </div>
                <p className="text-xs text-slate-400 font-mono">Impact Level: {selectedOwasp.impact}</p>
              </div>

              <button
                onClick={() => setSelectedOwasp(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-900 border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                {selectedOwasp.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 font-mono">Mapped CWE Identifiers:</span>
                {selectedOwasp.cweReferences.map((cwe) => (
                  <span key={cwe} className="bg-slate-900 text-cyan-300 border border-slate-800 px-2 py-0.5 rounded text-[11px] font-mono">
                    {cwe}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#070a12] border border-red-900/60 rounded-xl overflow-hidden">
                <div className="bg-red-950/80 px-4 py-2.5 border-b border-red-900/80 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    Vulnerable Code Pattern
                  </span>
                </div>
                <pre className="p-4 text-xs font-mono text-red-300 overflow-x-auto leading-relaxed">
                  <code>{selectedOwasp.vulnerableCodeSample}</code>
                </pre>
              </div>

              <div className="bg-[#070a12] border border-cyan-900/40 rounded-xl overflow-hidden">
                <div className="bg-[#0b1222] px-4 py-2.5 border-b border-cyan-900/40 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    Hardened Implementation Pattern
                  </span>
                </div>
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                  <code>{selectedOwasp.secureCodeSample}</code>
                </pre>
              </div>
            </div>

            <div className="bg-[#090d18] border border-slate-800 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-white font-mono flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                Defense-in-Depth Prevention Steps
              </h4>
              <ul className="space-y-1.5">
                {selectedOwasp.preventionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedOwasp(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
