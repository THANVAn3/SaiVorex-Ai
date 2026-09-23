import React from 'react';
import { SecurityProject, ActiveTab } from '../types';
import { Shield, FolderKanban, Code, Globe, AlertTriangle, Terminal, FileText, Activity, Plus, ArrowRight, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface ExecutiveDashboardProps {
  currentProject: SecurityProject | null;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenProjects: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  currentProject,
  onNavigateTab,
  onOpenProjects,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold rounded-full uppercase">
              COMMAND CENTER
            </span>
            <span className="text-slate-500 text-xs font-mono">•</span>
            <span className="text-slate-400 text-xs font-mono">SAIVOREX SECURITY ENGINE ONLINE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            SaiVorex <span className="text-cyan-400">Cybersecurity</span> Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Continuous threat auditing, automated SAST code reviews, HTTP header risk evaluations, and OWASP Top 10 compliance tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 relative z-10">
          <button
            onClick={onOpenProjects}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs rounded-2xl border border-slate-700 flex items-center gap-2 transition-all"
          >
            <FolderKanban className="w-4 h-4 text-cyan-400" />
            <span>SWITCH PROJECT</span>
          </button>

          <button
            onClick={() => onNavigateTab('analyzer')}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>RUN CODE AUDIT</span>
          </button>
        </div>
      </div>

      {currentProject ? (
        <div className="bg-slate-900/80 border border-cyan-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                ACTIVE SECURITY PROJECT WORKSPACE
              </span>
              <h3 className="text-lg font-bold font-mono text-white">{currentProject.name}</h3>
              <p className="text-xs text-slate-400">{currentProject.description}</p>
            </div>

            <div className="flex items-center gap-3 bg-[#070a12] p-3 rounded-xl border border-slate-800/80 shrink-0">
              <div>
                <span className="text-[9px] font-mono text-slate-500 block uppercase">SECURITY SCORE</span>
                <span className="text-lg font-bold font-mono text-cyan-400">{currentProject.securityScore}/100</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[9px] font-mono text-slate-500 block uppercase">AUDIT STATUS</span>
                <span className="text-xs font-bold font-mono text-emerald-400">{currentProject.status}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            <div className="p-3 bg-[#070a12] border border-slate-800/80 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 block font-bold">CRITICAL</span>
              <span className="text-base font-bold text-red-400">{currentProject.criticalCount}</span>
            </div>
            <div className="p-3 bg-[#070a12] border border-slate-800/80 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 block font-bold">HIGH</span>
              <span className="text-base font-bold text-amber-400">{currentProject.highCount}</span>
            </div>
            <div className="p-3 bg-[#070a12] border border-slate-800/80 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 block font-bold">MEDIUM</span>
              <span className="text-base font-bold text-yellow-400">{currentProject.mediumCount}</span>
            </div>
            <div className="p-3 bg-[#070a12] border border-slate-800/80 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-500 block font-bold">LOW</span>
              <span className="text-base font-bold text-blue-400">{currentProject.lowCount}</span>
            </div>
            <div className="p-3 bg-[#070a12] border border-slate-800/80 rounded-xl space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 block font-bold">CODE AUDITS</span>
              <span className="text-base font-bold text-emerald-400">{currentProject.codeAudits?.length || 0}</span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
          CYBERSECURITY AUDITING MODULES
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigateTab('analyzer')}
            className="p-5 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <Code className="w-5 h-5 text-cyan-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-mono text-white">Source Code SAST Auditor</h4>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Static code analysis, CWE detection, vulnerability line ranges & refactored patches.
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('urlaudit')}
            className="p-5 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-mono text-white">HTTP Header & Phishing Auditor</h4>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Inspect CSP, HSTS, X-Frame headers, CORS policies & phishing domain risk indicators.
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('owasp')}
            className="p-5 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-mono text-white">OWASP Top 10 Compliance Matrix</h4>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Assess coverage across A01-A10 pillars with remediation code examples.
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('payloads')}
            className="p-5 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <Terminal className="w-5 h-5 text-purple-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-mono text-white">Payload Laboratory & WAF Sandbox</h4>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Authorized test vector simulation for SQLi, XSS, Path Traversal & SSRF defense rules.
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('reports')}
            className="p-5 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-2xl cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-mono text-white">Audit Report Generator</h4>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Generate and export executive security audit reports in PDF, DOCX, and Markdown.
              </p>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('telemetry')}
            className="p-5 bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-mono text-white">Real-Time Telemetry Console</h4>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Live threat event stream, network interface scanning, and PC hotspot telemetry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
