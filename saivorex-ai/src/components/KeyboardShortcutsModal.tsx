import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  X,
  Search,
  Zap,
  Navigation,
  Activity,
  Terminal,
  Shield,
  CornerDownLeft,
  Sliders,
  Check
} from 'lucide-react';
import { ActiveTab } from '../types';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onTriggerAction?: (actionId: string) => void;
}

interface ShortcutItem {
  id: string;
  category: 'global' | 'navigation' | 'actions';
  label: string;
  description: string;
  keys: string[];
  altKeys?: string[];
  actionTab?: ActiveTab;
  actionId?: string;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onTriggerAction
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'global' | 'navigation' | 'actions'>('all');
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [recentlyTriggered, setRecentlyTriggered] = useState<string | null>(null);

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts: ShortcutItem[] = [
    {
      id: 'cmd-k',
      category: 'global',
      label: 'Command Palette & Quick Search',
      description: 'Open the omnibar to search tools, projects, and execute commands (prevents browser search)',
      keys: [modKey, 'K'],
      altKeys: [modKey, 'F']
    },
    {
      id: 'cmd-f',
      category: 'global',
      label: 'Find / In-App Omnibar Search',
      description: 'Intercepts browser search and opens SaiVorex quick search',
      keys: [modKey, 'F'],
      altKeys: ['/']
    },
    {
      id: 'shortcuts-modal',
      category: 'global',
      label: 'Keyboard Shortcuts Cheatsheet',
      description: 'Open this interactive reference hotkey guide',
      keys: [modKey, '?'],
      altKeys: ['?']
    },
    {
      id: 'close-modal',
      category: 'global',
      label: 'Dismiss Modal / Close Overlay',
      description: 'Exit dialogs, popovers, and return to active view',
      keys: ['Esc']
    },
    {
      id: 'toggle-theme',
      category: 'global',
      label: 'Toggle Cinematic Background',
      description: 'Switch between SOC Command Center and Earth Space backdrop',
      keys: [modKey, 'Shift', 'B'],
      actionId: 'toggle-theme'
    },

    {
      id: 'nav-dashboard',
      category: 'navigation',
      label: 'Command Dashboard',
      description: 'Overview of security posture, system health & metrics',
      keys: [modKey, '1'],
      altKeys: ['Alt', '1'],
      actionTab: 'dashboard'
    },
    {
      id: 'nav-analyzer',
      category: 'navigation',
      label: 'Source Code Auditor (SAST)',
      description: 'Inspect source code for OWASP & CWE vulnerabilities',
      keys: [modKey, '2'],
      altKeys: ['Alt', '2'],
      actionTab: 'analyzer'
    },
    {
      id: 'nav-urlaudit',
      category: 'navigation',
      label: 'URL & Security Header Auditor',
      description: 'Scan domains, analyze HTTP headers and phishing risk',
      keys: [modKey, '3'],
      altKeys: ['Alt', '3'],
      actionTab: 'urlaudit'
    },
    {
      id: 'nav-owasp',
      category: 'navigation',
      label: 'OWASP Top 10 Matrix',
      description: 'Explore vulnerabilities, impact rules, and remediations',
      keys: [modKey, '4'],
      altKeys: ['Alt', '4'],
      actionTab: 'owasp'
    },
    {
      id: 'nav-payloads',
      category: 'navigation',
      label: 'Payload Laboratory & WAF Sandbox',
      description: 'Test exploit strings, bypasses, and sanitization regex',
      keys: [modKey, '5'],
      altKeys: ['Alt', '5'],
      actionTab: 'payloads'
    },
    {
      id: 'nav-projects',
      category: 'navigation',
      label: 'Security Projects Manager',
      description: 'Manage audit workspaces and compliance scores',
      keys: [modKey, '6'],
      altKeys: ['Alt', '6'],
      actionTab: 'projects'
    },
    {
      id: 'nav-reports',
      category: 'navigation',
      label: 'Compliance Reports Generator',
      description: 'Export PDF, DOCX, and Markdown executive summaries',
      keys: [modKey, '7'],
      altKeys: ['Alt', '7'],
      actionTab: 'reports'
    },
    {
      id: 'nav-telemetry',
      category: 'navigation',
      label: 'Live Threat & PC Network Telemetry',
      description: 'Inspect live bandwidth, radio GHz, and latency',
      keys: [modKey, '8'],
      altKeys: ['Alt', '8'],
      actionTab: 'telemetry'
    },
    {
      id: 'nav-threatintel',
      category: 'navigation',
      label: 'Threat Intelligence & CVE Feed',
      description: 'Live adversary feeds and threat indicators',
      keys: [modKey, '9'],
      altKeys: ['Alt', '9'],
      actionTab: 'threatintel'
    },
    {
      id: 'nav-aiagents',
      category: 'navigation',
      label: 'Autonomous Security Fleet',
      description: 'Inspect self-orchestrating security defense agents',
      keys: [modKey, '0'],
      altKeys: ['Alt', '0'],
      actionTab: 'aiagents'
    },
    {
      id: 'nav-settings',
      category: 'navigation',
      label: 'Platform Settings & Diagnostics',
      description: 'Configure API keys, user profiles, and model engine',
      keys: [modKey, ','],
      altKeys: [modKey, 'Shift', 'S'],
      actionTab: 'settings'
    },
    {
      id: 'nav-help',
      category: 'navigation',
      label: 'Documentation & Knowledge Base',
      description: 'View architecture documentation and tutorial guides',
      keys: [modKey, 'Shift', 'H'],
      altKeys: ['F1'],
      actionTab: 'help'
    },

    {
      id: 'action-run-scan',
      category: 'actions',
      label: 'Execute Active Scan / Audit',
      description: 'Run SAST audit in Code Analyzer or scan target in URL Auditor',
      keys: [modKey, '↵ Enter'],
      actionId: 'run-scan'
    },
    {
      id: 'action-ping-gateway',
      category: 'actions',
      label: 'Ping Gateway & Refresh Telemetry',
      description: 'Measure live RTT latency and poll active network interface',
      keys: [modKey, 'Shift', 'L'],
      actionId: 'ping-gateway'
    },
    {
      id: 'action-load-sqli',
      category: 'actions',
      label: 'Load SQL Injection Sample',
      description: 'Pre-load vulnerable SQL query directly into Code Auditor',
      keys: [modKey, 'Shift', '1'],
      actionId: 'load-sqli'
    },
    {
      id: 'action-load-xss',
      category: 'actions',
      label: 'Load Cross-Site Scripting (XSS) Sample',
      description: 'Pre-load vulnerable DOM XSS snippet into Code Auditor',
      keys: [modKey, 'Shift', '2'],
      actionId: 'load-xss'
    },
    {
      id: 'action-load-ssrf',
      category: 'actions',
      label: 'Load SSRF Cloud Metadata Sample',
      description: 'Pre-load vulnerable AWS metadata SSRF into Code Auditor',
      keys: [modKey, 'Shift', '3'],
      actionId: 'load-ssrf'
    },
    {
      id: 'action-export-report',
      category: 'actions',
      label: 'Export Security Audit Report',
      description: 'Jump to report generator and prepare PDF/Markdown export',
      keys: [modKey, 'Shift', 'E'],
      actionTab: 'reports'
    }
  ];

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      let keyLabel = e.key.toUpperCase();
      if (e.ctrlKey) keyLabel = `CTRL+${keyLabel}`;
      if (e.metaKey) keyLabel = `CMD+${keyLabel}`;
      if (e.shiftKey && !keyLabel.includes('SHIFT')) keyLabel = `SHIFT+${keyLabel}`;
      setPressedKey(keyLabel);
      const timer = setTimeout(() => setPressedKey(null), 1000);
      return () => clearTimeout(timer);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredShortcuts = shortcuts.filter(s => {
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch =
      s.label.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.keys.join(' ').toLowerCase().includes(search.toLowerCase()) ||
      (s.altKeys && s.altKeys.join(' ').toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleExecuteShortcut = (s: ShortcutItem) => {
    setRecentlyTriggered(s.id);
    setTimeout(() => setRecentlyTriggered(null), 800);

    if (s.actionTab) {
      onNavigate(s.actionTab);
      onClose();
    } else if (s.actionId && onTriggerAction) {
      onTriggerAction(s.actionId);
      onClose();
    } else if (s.id === 'cmd-k' || s.id === 'cmd-f') {
      onClose();
      if (onTriggerAction) onTriggerAction('open-search');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#060c20]/95 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Keyboard Shortcuts & Command Hotkeys</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-semibold">
                  Interactive
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Navigate the entire security suite at terminal speed with single keys and combo commands.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-white/10 space-y-3 bg-slate-950/40">
          <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/25 flex items-start gap-3 text-xs">
            <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 mt-0.5 shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-1 text-slate-300">
              <div className="font-semibold text-cyan-300 flex items-center gap-2">
                <span>Why did Chrome search open? How to use shortcuts:</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">Solved</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                1. <strong>Click inside this app window first</strong>: Because this app runs inside a browser sandbox preview, clicking inside gives it keyboard focus.
                <br />
                2. <strong>Browser Search Intercepted</strong>: <kbd className="px-1 py-0.2 bg-black/60 rounded border border-white/15 text-cyan-300 font-mono">Ctrl + K</kbd> and <kbd className="px-1 py-0.2 bg-black/60 rounded border border-white/15 text-cyan-300 font-mono">Ctrl + F</kbd> now prevent Chrome's search bar and open our security search omnibar directly.
                <br />
                3. <strong>Click-to-Run</strong>: You can also click any row below to navigate or execute instantly without typing!
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter shortcuts by key or action (e.g. 'Ctrl+1', 'Enter', 'Code', 'Scan')..."
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 font-mono transition-all"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Shortcuts' },
              { id: 'navigation', label: 'Navigation (Ctrl+1..0)' },
              { id: 'actions', label: 'Commands & Actions' },
              { id: 'global', label: 'Global & Overlays' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {pressedKey && (
              <div className="ml-auto flex items-center gap-1 text-[11px] font-mono text-emerald-400 animate-pulse">
                <span>Key detected:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 font-bold">
                  {pressedKey}
                </kbd>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[50vh] scrollbar-thin">
          {filteredShortcuts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Keyboard className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
              <p className="text-xs">No shortcuts matching &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            filteredShortcuts.map((s) => {
              const isTriggered = recentlyTriggered === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => handleExecuteShortcut(s)}
                  className={`group p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer border ${
                    isTriggered
                      ? 'bg-cyan-500/20 border-cyan-400 scale-[0.99]'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-cyan-400/30'
                  }`}
                >
                  <div className="space-y-0.5 max-w-md">
                    <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <span>{s.label}</span>
                      {s.actionTab && (
                        <span className="text-[10px] font-mono font-normal text-slate-500">
                          &rarr; Tab
                        </span>
                      )}
                      {isTriggered && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Executing
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {s.description}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      {s.keys.map((k, i) => (
                        <kbd
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-black/60 border border-white/20 text-xs font-mono font-bold text-cyan-300 shadow-[0_2px_8px_rgba(0,0,0,0.5)] group-hover:border-cyan-400/50 group-hover:bg-cyan-950/40 transition-all"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                    {s.altKeys && (
                      <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-500">
                        <span>or</span>
                        {s.altKeys.map((ak, idx) => (
                          <kbd key={idx} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                            {ak}
                          </kbd>
                        ))}
                      </div>
                    )}
                    <CornerDownLeft className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-6 py-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Tip: Click any shortcut row above to execute or jump directly.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-white">
              Esc
            </kbd>
            <span>to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
};
