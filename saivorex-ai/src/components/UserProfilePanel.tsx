import React from 'react';
import { UserProfile } from '../types';
import { User, Shield, Building2, Calendar, Key, CheckCircle2, Award } from 'lucide-react';

interface UserProfilePanelProps {
  currentUser: UserProfile | null;
}

export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ currentUser }) => {
  if (!currentUser) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono text-xs">
        No active user profile session found. Please log in.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono text-xs">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-bold text-xl">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded font-bold">
              AUTHORIZED COMMANDER
            </span>
          </div>
          <p className="text-slate-400">{currentUser.email}</p>
        </div>
      </div>

      {/* Account Info Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
          <span className="text-slate-400 font-bold text-[11px] uppercase block">ORGANIZATION SECURITY IDENTITY</span>
          <div className="flex items-center gap-3 p-3 bg-[#070a12] border border-slate-800/80 rounded-xl">
            <Building2 className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-white font-bold block">{currentUser.organizationId.toUpperCase()}</span>
              <span className="text-[10px] text-slate-500">Authorized Organization Domain Identifier</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
          <span className="text-slate-400 font-bold text-[11px] uppercase block">AUTHENTICATION CLEARANCE LEVEL</span>
          <div className="flex items-center gap-3 p-3 bg-[#070a12] border border-slate-800/80 rounded-xl">
            <Award className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-white font-bold block">Level 5 Cyber Auditor</span>
              <span className="text-[10px] text-slate-500">Full SAST & Header Assessment Permissions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Integrity */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
        <span className="text-slate-400 font-bold text-[11px] uppercase block">ACTIVE TOKEN INTEGRITY</span>
        <div className="p-3 bg-[#070a12] border border-slate-800/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span>Authorization Token Format:</span>
            <span className="text-cyan-400 font-bold">Bearer SHA-256 HMAC</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Session Server Verification:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED (/api/auth/me)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
