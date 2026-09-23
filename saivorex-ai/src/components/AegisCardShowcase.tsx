import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { Github, Eye, Shield, Terminal, ArrowRight, CheckCircle2, Lock, Cpu, Sparkles, AlertTriangle } from 'lucide-react';

interface AegisCardShowcaseProps {
  onLaunchScanner: (tab: ActiveTab) => void;
}

export const AegisCardShowcase: React.FC<AegisCardShowcaseProps> = ({ onLaunchScanner }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  return (
    <div className="space-y-8 py-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Project SaiVorex
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">SAST & Header Intelligence Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Vulnerability & Exploit Security Suite
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Automated SAST code auditing, HTTP header verification, and OWASP Top 10 remediation blueprinting.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Live Environment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="md:col-span-2 md:row-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                Featured Security Engine
              </span>
              <span className="text-xs font-mono text-slate-500">v2.5 Build</span>
            </div>

            <div className="relative w-full h-48 bg-[#070a14]/90 rounded-2xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden my-2">
              <div className="absolute w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative w-36 h-36 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/40 animate-[spin_18s_linear_infinite]" />
                <div className="absolute inset-3 rounded-full border border-dashed border-cyan-400/60 animate-[spin_10s_linear_infinite_reverse]" />

                <div className="relative z-10 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="/logo.png"
                    alt="SaiVorex Logo"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedJpg) {
                        target.dataset.triedJpg = 'true';
                        target.src = '/logo.jpg';
                      } else {
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }
                    }}
                    className="w-20 h-20 object-contain filter drop-shadow-[0_0_20px_rgba(6,182,212,0.9)] animate-pulse"
                  />
                  <Shield className="hidden w-16 h-16 text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.9)] animate-pulse" />
                </div>
              </div>

              <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] font-bold text-cyan-400 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>VULNERABILITY SCANNER ACTIVE</span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">SaiVorex Core</h2>
              <p className="text-xs text-purple-400 font-semibold">Automated Vulnerability & Exploit Analyzer</p>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Continuous web vulnerability auditing tool analyzing OWASP Top 10 vulnerabilities, headers, and code snippets with automated remediation suggestions.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-slate-800/60 text-slate-300 border border-slate-700/60 px-3 py-1 rounded-xl text-[11px] font-mono">
                Cyber Security
              </span>
              <span className="bg-slate-800/60 text-slate-300 border border-slate-700/60 px-3 py-1 rounded-xl text-[11px] font-mono">
                Python
              </span>
              <span className="bg-slate-800/60 text-slate-300 border border-slate-700/60 px-3 py-1 rounded-xl text-[11px] font-mono">
                Security Audit
              </span>
              <span className="bg-slate-800/60 text-slate-300 border border-slate-700/60 px-3 py-1 rounded-xl text-[11px] font-mono">
                OWASP
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 mt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            <button
              onClick={() => setShowDetailModal(true)}
              className="flex items-center justify-center gap-2 bg-slate-100 text-slate-900 hover:bg-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all uppercase tracking-tight shadow-md"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 border border-blue-500/20 rounded-3xl p-6 shadow-xl flex flex-col justify-between text-white">
          <div className="text-xs text-blue-200 uppercase tracking-widest font-mono font-bold">
            LLM SAST Precision
          </div>
          <div className="py-2">
            <div className="text-4xl font-bold tracking-tighter">
              82.6<span className="text-xl">%</span>
            </div>
            <div className="text-xs text-blue-100 mt-1 font-sans">
              CyberSecEval benchmark score (+1.8% F1 vs base)
            </div>
          </div>
          <div className="w-full bg-blue-900/40 rounded-full h-1.5 overflow-hidden">
            <div className="bg-white h-full rounded-full w-[82.6%]" />
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inference Latency</h3>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-tighter bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Optimal
            </span>
          </div>

          <div className="my-2">
            <div className="text-2xl font-bold text-white tracking-tight">184ms <span className="text-xs font-normal text-slate-500">avg</span></div>
            <div className="flex items-end gap-1 h-10 mt-3">
              <div className="w-full bg-slate-800 h-4 rounded-t-sm" />
              <div className="w-full bg-slate-800 h-6 rounded-t-sm" />
              <div className="w-full bg-slate-800 h-5 rounded-t-sm" />
              <div className="w-full bg-emerald-500 h-8 rounded-t-sm" />
              <div className="w-full bg-emerald-500 h-7 rounded-t-sm" />
              <div className="w-full bg-slate-800 h-5 rounded-t-sm" />
              <div className="w-full bg-emerald-500 h-9 rounded-t-sm" />
              <div className="w-full bg-slate-800 h-4 rounded-t-sm" />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">AST & Token Rate: 1.4k tokens/sec</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-white">Active Rulesets</h2>
              <span className="text-[10px] font-mono text-slate-500 uppercase">4 Loaded</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">OWASP Top 10</div>
                  <div className="text-[10px] text-slate-500">2021 Standard</div>
                </div>
                <div className="text-[10px] font-mono text-slate-400">Active</div>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">CWE Top 25</div>
                  <div className="text-[10px] text-slate-500">Software Errors</div>
                </div>
                <div className="text-[10px] font-mono text-slate-400">Active</div>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">HTTP Security Headers</div>
                  <div className="text-[10px] text-slate-500">HSTS / CSP / CORS</div>
                </div>
                <div className="text-[10px] font-mono text-slate-400">Active</div>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">PCI-DSS 4.0</div>
                  <div className="text-[10px] text-slate-500">Payment Security</div>
                </div>
                <div className="text-[10px] font-mono text-slate-400">Active</div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 font-mono text-center border-t border-slate-800/80">
            Rule engine updated 12m ago
          </div>
        </div>

        <div className="md:col-span-2 bg-[#141926] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Interactive SAST Engine
              </h3>
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">
              Launch Code Security Audit
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Scan Python, JS, SQL & PHP code against CWE standards with instant automated secure refactoring.
            </p>
          </div>

          <button
            onClick={() => onLaunchScanner('analyzer')}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-2xl text-xs uppercase tracking-tight flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0"
          >
            <span>Launch Audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div 
          onClick={() => onLaunchScanner('analyzer')}
          className="bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-3xl cursor-pointer group transition-all shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-base flex items-center justify-between">
              <span>Code Security Auditor</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scan Python, JavaScript, SQL, and PHP code snippets against CWE standards with automated line-by-line secure code refactoring.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-400 font-medium">
            Run SAST Scanner →
          </div>
        </div>

        <div 
          onClick={() => onLaunchScanner('urlaudit')}
          className="bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-3xl cursor-pointer group transition-all shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-base flex items-center justify-between">
              <span>Security Header Audit</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify HTTP response security headers (HSTS, CSP, X-Frame-Options, CORS) and calculate domain health scores.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400 font-medium">
            Inspect Endpoint →
          </div>
        </div>

        <div 
          onClick={() => onLaunchScanner('owasp')}
          className="bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 p-6 rounded-3xl cursor-pointer group transition-all shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-base flex items-center justify-between">
              <span>OWASP Top 10 Matrix</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deep dive into OWASP Top 10 attack vectors with vulnerable vs secure code side-by-side examples and prevention checklists.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-amber-400 font-medium">
            Explore OWASP Matrix →
          </div>
        </div>
      </div>

      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0b0f1d] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono">
                  S
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">SaiVorex Platform Details</h3>
                  <p className="text-xs text-cyan-400 font-mono">Automated Vulnerability & Exploit Analyzer</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>SaiVorex</strong> is an automated cybersecurity vulnerability scanner designed for web developers, DevSecOps engineers, and security researchers. It combines static code analysis (SAST) with deep threat intelligence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">SAST Engine</span>
                    Line-by-line static analysis identifying OWASP Top 10 flaws.
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Automated Code Refactoring</span>
                    Generates secure production code fixes in real-time.
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">HTTP Header Auditor</span>
                    Evaluates HSTS, CSP, CORS, and cookie flags for domains.
                  </div>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Exploit Scenario Breakdown</span>
                    Detailed proof-of-concept attack vector walk-throughs.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 rounded-2xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  onLaunchScanner('analyzer');
                }}
                className="px-5 py-2 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-white text-slate-950 flex items-center gap-2 shadow-md uppercase tracking-tight"
              >
                <span>Launch Interactive Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
