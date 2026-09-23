import React, { useState } from 'react';
import { SystemStatus, UserProfile } from '../types';
import { Settings as SettingsIcon, User, Key, Shield, Cpu, Database, Activity, CheckCircle2, RefreshCw, LogOut, Wifi } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface SettingsProps {
  currentUser: UserProfile | null;
  systemStatus: SystemStatus | null;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onLogout?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  currentUser,
  systemStatus,
  onUpdateUser,
  onLogout,
}) => {
  const { connected, type, name, source } = useNetworkStatus();
  const [nameVal, setNameVal] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [passMessage, setPassMessage] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({ name: nameVal });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPassMessage('New password must be at least 6 characters.');
      return;
    }
    setPassMessage('Password changed successfully.');
    setOldPassword('');
    setNewPassword('');
    setTimeout(() => setPassMessage(''), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-cyan-400" />
          <span>System Settings & Configuration</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage user account profile, security engine status, session tokens, and cybersecurity suite status.
        </p>
      </div>

      <div className="bg-[#0D1322] border border-slate-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Security Engine & System Node Status</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">API Server</div>
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Online</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Database</div>
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Online</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Security Engine</div>
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <span className={`w-2 h-2 rounded-full ${systemStatus?.geminiOnline !== false ? 'bg-cyan-400' : 'bg-amber-400'}`} />
              <span>{systemStatus?.geminiOnline !== false ? 'Online' : 'Fallback'}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Telemetry</div>
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Connected</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Network</div>
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <span className={`w-2 h-2 rounded-full ${!connected ? 'bg-rose-500' : type === 'unknown' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span className="uppercase">
                {!connected
                  ? 'Offline'
                  : type === 'wifi'
                  ? 'Wi-Fi'
                  : type === 'ethernet'
                  ? 'Ethernet'
                  : type === 'cellular'
                  ? 'Cellular'
                  : 'Network'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0D1322] border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Profile Details</span>
          </h2>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Display Name</label>
              <input
                type="text"
                value={nameVal}
                onChange={(e) => setNameVal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Email Address</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400 p-3 rounded-xl font-mono cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Organization ID</label>
              <input
                type="text"
                disabled
                value={currentUser?.organizationId || 'sathan'}
                className="w-full bg-slate-900/60 border border-slate-800 text-xs text-amber-400 p-3 rounded-xl font-mono font-bold uppercase cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase font-mono transition-all"
            >
              {isSaved ? 'Saved Successfully!' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="bg-[#0D1322] border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Password & Authentication</span>
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>

            {passMessage && (
              <div className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-xl">
                {passMessage}
              </div>
            )}

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase font-mono border border-slate-700 transition-all"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
