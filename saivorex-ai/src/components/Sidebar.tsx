import React from 'react';
import { ActiveTab, SecurityProject, UserProfile } from '../types';
import {
  Shield,
  LayoutDashboard,
  Code,
  Globe,
  AlertTriangle,
  Terminal,
  Folder,
  FileText,
  Activity,
  Radio,
  Bot,
  Settings,
  X,
  Quote,
  Keyboard
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  projects: SecurityProject[];
  activeProject: SecurityProject | null;
  onSelectProject: (project: SecurityProject) => void;
  onCreateProjectClick: () => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onOpenShortcutsModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  onOpenShortcutsModal,
}) => {
  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modPrefix = isMac ? '⌘' : 'Ctrl+';

  const navItems: { id: ActiveTab; label: string; icon: any; shortcut?: string; isNew?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: `${modPrefix}1` },
    { id: 'analyzer', label: 'Code Auditor', icon: Code, shortcut: `${modPrefix}2` },
    { id: 'urlaudit', label: 'URL & Headers', icon: Globe, shortcut: `${modPrefix}3` },
    { id: 'owasp', label: 'OWASP Top 10', icon: AlertTriangle, shortcut: `${modPrefix}4` },
    { id: 'payloads', label: 'Payload Lab', icon: Terminal, shortcut: `${modPrefix}5` },
    { id: 'projects', label: 'Projects', icon: Folder, shortcut: `${modPrefix}6` },
    { id: 'reports', label: 'Audit Reports', icon: FileText, shortcut: `${modPrefix}7` },
    { id: 'telemetry', label: 'Telemetry', icon: Activity, shortcut: `${modPrefix}8` },
    { id: 'threatintel', label: 'Threat Intel', icon: Radio, shortcut: `${modPrefix}9` },
    { id: 'aiagents', label: 'Security Agents', icon: Bot, isNew: true, shortcut: `${modPrefix}0` },
    { id: 'settings', label: 'Settings', icon: Settings, shortcut: `${modPrefix},` },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#040817]/65 backdrop-blur-2xl border-r border-white/10 w-64 text-slate-200 select-none shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div
          onClick={() => {
            setActiveTab('dashboard');
            if (isOpenMobile) onCloseMobile();
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/35 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_18px_rgba(6,182,212,0.35)] backdrop-blur-md">
            <Shield className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
          </div>
          <div>
            <div className="font-extrabold text-base text-white tracking-wide flex items-center gap-1.5">
              <span>SaiVorex</span>
              <span className="text-cyan-400">AI</span>
            </div>
            <div className="text-[8px] font-mono tracking-[0.22em] text-slate-400 uppercase font-semibold">
              SECURE &middot; ANALYZE &middot; DEFEND
            </div>
          </div>
        </div>

        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/40 via-cyan-500/25 to-transparent border border-cyan-400/50 text-white font-semibold shadow-[0_0_20px_rgba(6,182,212,0.22)] backdrop-blur-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] hover:border hover:border-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="text-[13px]">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.isNew && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono font-bold tracking-wider shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                    New
                  </span>
                )}
                {item.shortcut && (
                  <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-white/[0.04] group-hover:bg-white/[0.08] border border-white/5 group-hover:border-cyan-400/30 text-[9px] font-mono text-slate-500 group-hover:text-cyan-300 font-semibold transition-colors">
                    {item.shortcut}
                  </kbd>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-white/10 space-y-2">
        {onOpenShortcutsModal && (
          <button
            onClick={() => {
              onOpenShortcutsModal();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-cyan-400/30 text-xs text-slate-300 hover:text-cyan-300 transition-all font-mono group"
            title="Open Keyboard Shortcuts Cheatsheet (Ctrl + ?)"
          >
            <div className="flex items-center gap-2">
              <Keyboard className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-sans font-medium text-slate-300 group-hover:text-white">Hotkeys Guide</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-cyan-300 font-bold">
              {modPrefix}?
            </kbd>
          </button>
        )}

        <div className="p-3 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden">
          <div className="absolute top-1 right-2 opacity-15 text-cyan-400">
            <Quote className="w-8 h-8" />
          </div>
          <p className="text-[11px] text-slate-300 italic font-sans leading-relaxed">
            &ldquo;A safer digital world, built with intelligence.&rdquo;
          </p>
          <div className="mt-1 text-[10px] font-mono text-slate-400 text-right font-medium">
            &mdash; SaiVorex AI
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        {content}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
