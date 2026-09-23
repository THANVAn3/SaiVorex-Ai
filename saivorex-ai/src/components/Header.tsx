import React, { useState } from 'react';
import { ActiveTab, SecurityProject, UserProfile } from '../types';
import {
  Zap,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Shield,
  Menu,
  Keyboard
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isScanning: boolean;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenShortcutsModal?: () => void;
  projects?: SecurityProject[];
  activeProject?: SecurityProject | null;
  onSelectProject?: (project: SecurityProject) => void;
}

export const Header: React.FC<HeaderProps> = ({
  setActiveTab,
  currentUser,
  onLogout,
  onToggleMobileMenu,
  onOpenCommandPalette,
  onOpenShortcutsModal,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <header className="sticky top-0 z-40 bg-[#040817]/60 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 select-none">
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={onOpenCommandPalette}
            className="flex-1 flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-cyan-400/40 px-3.5 py-2 rounded-2xl text-xs text-slate-400 cursor-pointer transition-all shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-md group"
          >
            <div className="p-1 rounded-lg bg-cyan-500/15 text-cyan-400 group-hover:text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <Zap className="w-3.5 h-3.5 fill-cyan-400/30" />
            </div>
            <span className="flex-1 text-slate-300 text-xs sm:text-sm font-sans truncate">
              Search projects, tools, or run a command...
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.08] border border-white/15 text-[11px] font-mono text-cyan-300 font-bold">
              {modKey} K / F
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onOpenShortcutsModal && (
            <button
              onClick={onOpenShortcutsModal}
              className="p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/[0.08] transition-all border border-white/10 hover:border-cyan-400/40 flex items-center gap-1.5 text-xs font-mono"
              title="Keyboard Shortcuts Cheatsheet (Ctrl + ?)"
            >
              <Keyboard className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline text-[11px] font-bold text-slate-300">Hotkeys</span>
              <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/15 text-[10px] text-cyan-300 font-bold">
                {modKey} ?
              </kbd>
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors relative border border-transparent hover:border-white/10"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#040817] shadow-[0_0_8px_#f43f5e]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-[#060e22]/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] p-3 space-y-2 z-50 text-xs animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-white">Live Alerts</span>
                  <span className="text-[10px] text-cyan-400 font-mono font-semibold">2 unread</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="text-[11px] font-semibold text-rose-400">DDoS Attempt Mitigated</div>
                  <div className="text-[10px] text-slate-300">Target IP 183.12.45.22 blocked by firewall.</div>
                  <div className="text-[9px] text-slate-500 font-mono">2 minutes ago</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="text-[11px] font-semibold text-amber-400">SAST Scan Completed</div>
                  <div className="text-[10px] text-slate-300">E-commerce Platform report generated.</div>
                  <div className="text-[9px] text-slate-500 font-mono">18 minutes ago</div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-full hover:bg-white/[0.08] transition-all border border-white/10 hover:border-cyan-400/40"
            >
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  <span className="font-bold text-xs text-cyan-300 font-mono">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'T'}
                  </span>
                </div>
              </div>

              <div className="text-left hidden sm:block leading-tight">
                <div className="text-xs font-bold text-white">
                  {currentUser?.name || 'Thanvan'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {currentUser?.role || 'Lead Analyst'}
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#060e22]/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] p-2.5 space-y-1 z-50 text-xs animate-in fade-in">
                <div className="p-2.5 bg-white/[0.04] rounded-xl space-y-1 font-mono border border-white/10">
                  <div className="text-xs font-bold text-white truncate">{currentUser?.name || 'Thanvan'}</div>
                  <div className="text-[10px] text-slate-300 truncate">{currentUser?.email || 'thanvan328@gmail.com'}</div>
                  <div className="text-[10px] text-cyan-400 flex items-center gap-1 pt-1">
                    <Shield className="w-3 h-3" />
                    <span>Role: Lead Security Analyst</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.08] flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account & Settings</span>
                </button>

                {onLogout && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors border-t border-white/10"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

