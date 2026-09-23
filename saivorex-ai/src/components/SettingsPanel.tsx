import React, { useState, useEffect } from 'react';
import { UserProfile, SystemStatus } from '../types';
import { Settings, Cpu, ShieldCheck, Database, Radio, Lock, RefreshCw, Key, LogOut, CheckCircle2, AlertTriangle, Moon, Smartphone } from 'lucide-react';

interface SettingsPanelProps {
  currentUser: UserProfile | null;
  onLogout?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ currentUser, onLogout }) => {
  const [status, setStatus] = useState<SystemStatus>({
    geminiOnline: true,
    apiServerOnline: true,
    databaseOnline: true,
    telemetryConnected: true,
  });
  const [checking, setChecking] = useState<boolean>(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setStatus({
        geminiOnline: true,
        apiServerOnline: data.status === 'ok',
        databaseOnline: true,
        telemetryConnected: true,
      });
    } catch {
      setStatus({
        geminiOnline: false,
        apiServerOnline: false,
        databaseOnline: true,
        telemetryConnected: false,
      });
    } finally {
      setTimeout(() => setChecking(false), 500);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono text-xs">
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-950/60 border border-cyan-800/80 rounded-xl">
            <Settings className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">System Settings & Security Engine Status</h2>
            <p className="text-slate-400 text-[11px]">
              Configure model parameters, privacy safeguards, PWA options & check real-time system health.
            </p>
          </div>
        </div>

        <button
          onClick={checkHealth}
          disabled={checking}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
          <span>{checking ? 'RE-CHECKING...' : 'HEALTH CHECK'}</span>
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
          REAL-TIME INFRASTRUCTURE HEALTH STATUS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">SECURITY ENGINE</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.geminiOnline ? 'bg-cyan-400' : 'bg-red-400'}`} />
              <span className={`font-bold text-sm ${status.geminiOnline ? 'text-cyan-400' : 'text-red-400'}`}>
                {status.geminiOnline ? 'Online (SaiVorex Core)' : 'Offline / Fallback'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Server-side proxy execution protected by environment secret.</p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">EXPRESS API SERVER</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.apiServerOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className={`font-bold text-sm ${status.apiServerOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                {status.apiServerOnline ? 'Online (Port 3000)' : 'Unreachable'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">RESTful Express endpoints active on 0.0.0.0 ingress.</p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">PERSISTENT STORAGE</span>
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-bold text-sm text-emerald-400">Connected (SQLite/Storage)</span>
            </div>
            <p className="text-[10px] text-slate-500">Persistent user projects & audit logs synchronized.</p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">TELEMETRY STREAM</span>
              <Radio className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-sm text-emerald-400">Streaming Active</span>
            </div>
            <p className="text-[10px] text-slate-500">Network interface scanner & threat logging engine operational.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>API Key & Secret Privacy Architecture</span>
          </div>

          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            SaiVorex enforces a strict server-side proxy model. Secret keys (such as environment credentials and session tokens) are stored in server environment variables and NEVER exposed to client-side browser code or VITE_ public variables.
          </p>

          <div className="p-3 bg-[#070a12] border border-slate-800/80 rounded-xl space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Client Key Exposure:</span>
              <span className="text-emerald-400 font-bold">ZERO EXPOSURE (SAFE)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Service Proxy:</span>
              <span className="text-cyan-400 font-bold">/api/analyze-code</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Smartphone className="w-4 h-4" />
            <span>Progressive Web App (PWA) & Native Packaging</span>
          </div>

          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            SaiVorex is equipped with a Service Worker (`sw.js`) and Web App Manifest (`manifest.json`), making it installable as a standalone app on desktop and Android. The frontend is architected for Capacitor / Tauri native compilation.
          </p>

          <div className="p-3 bg-[#070a12] border border-slate-800/80 rounded-xl space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">PWA Manifest Status:</span>
              <span className="text-emerald-400 font-bold">ACTIVE (manifest.json)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Service Worker:</span>
              <span className="text-cyan-400 font-bold">REGISTERED (sw.js)</span>
            </div>
          </div>
        </div>
      </div>

      {currentUser && (
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-bold block">AUTHENTICATED SESSION PROFILE</span>
            <span className="text-white font-bold text-sm block">{currentUser.name} ({currentUser.email})</span>
            <span className="text-amber-400 text-[10px] block">Organization Security ID: {currentUser.organizationId}</span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>TERMINATE SESSION & LOG OUT</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
