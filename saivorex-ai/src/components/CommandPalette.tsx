import React, { useState, useEffect, useRef } from 'react';
import { ActiveTab, SecurityProject } from '../types';
import {
  Search,
  Code,
  Globe,
  AlertTriangle,
  Terminal,
  FileText,
  Activity,
  Folder,
  Shield,
  X,
  CornerDownLeft,
  Bot,
  Radio,
  Settings,
  HelpCircle,
  Zap,
  Sparkles,
  Play,
  RotateCcw,
  Keyboard,
  Layers
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
  projects: SecurityProject[];
  onSelectProject?: (project: SecurityProject) => void;
  onTriggerAction?: (actionId: string) => void;
  onOpenShortcutsModal?: () => void;
}

interface PaletteItem {
  id: string;
  type: 'tool' | 'command' | 'project';
  label: string;
  desc: string;
  icon: React.ReactNode;
  shortcut?: string;
  tab?: ActiveTab;
  actionId?: string;
  project?: SecurityProject;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  projects,
  onSelectProject,
  onTriggerAction,
  onOpenShortcutsModal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const tools: PaletteItem[] = [
    {
      id: 'tool-dashboard',
      type: 'tool',
      tab: 'dashboard',
      label: 'Command Dashboard',
      desc: 'System security posture, real-time threat graphs & metrics',
      icon: <Shield className="w-4 h-4 text-cyan-400" />,
      shortcut: `${modKey} 1`
    },
    {
      id: 'tool-analyzer',
      type: 'tool',
      tab: 'analyzer',
      label: 'Source Code Security Auditor (SAST)',
      desc: 'Static application security testing, OWASP flaw detection & auto-patching',
      icon: <Code className="w-4 h-4 text-cyan-400" />,
      shortcut: `${modKey} 2`
    },
    {
      id: 'tool-urlaudit',
      type: 'tool',
      tab: 'urlaudit',
      label: 'URL & Security Header Auditor',
      desc: 'Evaluate HTTP security headers, attack surface, and phishing confidence',
      icon: <Globe className="w-4 h-4 text-emerald-400" />,
      shortcut: `${modKey} 3`
    },
    {
      id: 'tool-owasp',
      type: 'tool',
      tab: 'owasp',
      label: 'OWASP Top 10 Compliance Matrix',
      desc: 'Comprehensive 2021 vulnerability checklist and code remediations',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      shortcut: `${modKey} 4`
    },
    {
      id: 'tool-payloads',
      type: 'tool',
      tab: 'payloads',
      label: 'Payload Laboratory & WAF Sandbox',
      desc: 'Test SQLi, XSS, SSRF exploits and regex defense patterns',
      icon: <Terminal className="w-4 h-4 text-purple-400" />,
      shortcut: `${modKey} 5`
    },
    {
      id: 'tool-projects',
      type: 'tool',
      tab: 'projects',
      label: 'Security Projects Manager',
      desc: 'Manage audit workspaces, tracked vulnerabilities and client reports',
      icon: <Folder className="w-4 h-4 text-indigo-400" />,
      shortcut: `${modKey} 6`
    },
    {
      id: 'tool-reports',
      type: 'tool',
      tab: 'reports',
      label: 'Compliance Report Generator',
      desc: 'Export executive PDF, DOCX, and Markdown audit deliverables',
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      shortcut: `${modKey} 7`
    },
    {
      id: 'tool-telemetry',
      type: 'tool',
      tab: 'telemetry',
      label: 'Live Threat & PC Network Telemetry',
      desc: 'Probe connection medium, live link speed (Mbps), radio GHz & gateway RTT',
      icon: <Activity className="w-4 h-4 text-rose-400" />,
      shortcut: `${modKey} 8`
    },
    {
      id: 'tool-threatintel',
      type: 'tool',
      tab: 'threatintel',
      label: 'Threat Intelligence & CVE Tracker',
      desc: 'Live vulnerability feeds, IOCs, and active adversary advisories',
      icon: <Radio className="w-4 h-4 text-amber-400" />,
      shortcut: `${modKey} 9`
    },
    {
      id: 'tool-aiagents',
      type: 'tool',
      tab: 'aiagents',
      label: 'Autonomous Security Fleet',
      desc: 'Orchestrate autonomous security agents for automated defense & fuzzing',
      icon: <Bot className="w-4 h-4 text-indigo-400" />,
      shortcut: `${modKey} 0`,
      badge: 'New'
    },
    {
      id: 'tool-settings',
      type: 'tool',
      tab: 'settings',
      label: 'Settings & Security Configurations',
      desc: 'Manage API keys, environment settings, and audit preferences',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      shortcut: `${modKey} ,`
    },
    {
      id: 'tool-help',
      type: 'tool',
      tab: 'help',
      label: 'Documentation & Architecture Guide',
      desc: 'Technical handbook and vulnerability analysis methodologies',
      icon: <HelpCircle className="w-4 h-4 text-emerald-400" />,
      shortcut: `${modKey} ⇧ H`
    },
  ];

  const commandActions: PaletteItem[] = [
    {
      id: 'cmd-run-scan',
      type: 'command',
      actionId: 'run-scan',
      label: '> Run Active Security Scan',
      desc: 'Trigger SAST analysis on current code or scan target domain',
      icon: <Play className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />,
      shortcut: `${modKey} ↵`
    },
    {
      id: 'cmd-load-sqli',
      type: 'command',
      actionId: 'load-sqli',
      label: '> Load SQL Injection Vulnerability Preset',
      desc: 'Pre-load raw unparameterized SQL query into Code Auditor',
      icon: <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />,
      shortcut: `${modKey} ⇧ 1`
    },
    {
      id: 'cmd-load-xss',
      type: 'command',
      actionId: 'load-xss',
      label: '> Load Cross-Site Scripting (XSS) Preset',
      desc: 'Pre-load dangerouslySetInnerHTML XSS flaw into Code Auditor',
      icon: <Zap className="w-4 h-4 text-rose-400 fill-rose-400/20" />,
      shortcut: `${modKey} ⇧ 2`
    },
    {
      id: 'cmd-load-ssrf',
      type: 'command',
      actionId: 'load-ssrf',
      label: '> Load SSRF AWS Metadata Flaw Preset',
      desc: 'Pre-load internal IP fetch vulnerability into Code Auditor',
      icon: <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />,
      shortcut: `${modKey} ⇧ 3`
    },
    {
      id: 'cmd-ping-gateway',
      type: 'command',
      actionId: 'ping-gateway',
      label: '> Ping Gateway & Measure Live Latency',
      desc: 'Send an immediate diagnostic ping to test gateway round-trip latency',
      icon: <Activity className="w-4 h-4 text-purple-400" />,
      shortcut: `${modKey} ⇧ L`
    },
    {
      id: 'cmd-sync-agents',
      type: 'command',
      actionId: 'sync-agents',
      label: '> Sync Autonomous Security Agents',
      desc: 'Poll nodes and synchronize autonomous defense agents',
      icon: <RotateCcw className="w-4 h-4 text-indigo-400" />,
      tab: 'aiagents'
    },
    {
      id: 'cmd-toggle-theme',
      type: 'command',
      actionId: 'toggle-theme',
      label: '> Toggle Backdrop (SOC Command / Earth Space)',
      desc: 'Switch between cyberpunk security operations center and space view',
      icon: <Layers className="w-4 h-4 text-blue-400" />,
      shortcut: `${modKey} ⇧ B`
    },
    {
      id: 'cmd-shortcuts',
      type: 'command',
      actionId: 'show-shortcuts',
      label: '> Open Keyboard Shortcuts Reference',
      desc: 'View all keyboard shortcuts and hotkeys available across the suite',
      icon: <Keyboard className="w-4 h-4 text-cyan-300" />,
      shortcut: '?'
    }
  ];

  const projectItems: PaletteItem[] = projects.map(p => ({
    id: `project-${p.id}`,
    type: 'project',
    project: p,
    label: p.name,
    desc: p.description || 'Security project audit workspace',
    icon: <Folder className="w-4 h-4 text-indigo-400" />,
    badge: `Score: ${p.securityScore}`
  }));

  const cleanQuery = query.trim().toLowerCase();
  const isCommandOnly = cleanQuery.startsWith('>');
  const searchFilter = isCommandOnly ? cleanQuery.slice(1).trim() : cleanQuery;

  const filteredItems: PaletteItem[] = [
    ...(isCommandOnly ? [] : tools.filter(t => t.label.toLowerCase().includes(searchFilter) || t.desc.toLowerCase().includes(searchFilter))),
    ...commandActions.filter(c => c.label.toLowerCase().includes(searchFilter) || c.desc.toLowerCase().includes(searchFilter)),
    ...(isCommandOnly ? [] : projectItems.filter(p => p.label.toLowerCase().includes(searchFilter) || p.desc.toLowerCase().includes(searchFilter)))
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeItem = (item?: PaletteItem) => {
    const target = item || filteredItems[selectedIndex];
    if (!target) return;

    if (target.type === 'tool' && target.tab) {
      onNavigate(target.tab);
      onClose();
    } else if (target.type === 'command') {
      if (target.actionId === 'show-shortcuts') {
        onClose();
        if (onOpenShortcutsModal) onOpenShortcutsModal();
      } else if (target.actionId && onTriggerAction) {
        onTriggerAction(target.actionId);
        onClose();
      } else if (target.tab) {
        onNavigate(target.tab);
        onClose();
      }
    } else if (target.type === 'project' && target.project) {
      if (onSelectProject) onSelectProject(target.project);
      onNavigate('projects');
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K' || e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, filteredItems.length - 1)));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeItem(filteredItems[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#060c20]/95 backdrop-blur-2xl border border-white/15 rounded-3xl w-full max-w-2xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[82vh] animate-in zoom-in-95 duration-150 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-white/10 px-5 py-4 flex items-center gap-3 bg-white/[0.02]">
          <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
            <Zap className="w-4 h-4 fill-cyan-400/30" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a tool name, command, or '>' for quick actions... (↑ ↓ to navigate)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[10px] font-mono text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-white/5"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-2 border-b border-white/5 bg-slate-950/40 flex items-center gap-2 text-[10px] font-mono overflow-x-auto scrollbar-none">
          <span className="text-slate-500 uppercase font-bold tracking-wider">Quick Filters:</span>
          <button
            onClick={() => setQuery('')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              !query ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setQuery('>')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              query.startsWith('>') ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            &gt; Commands ({commandActions.length})
          </button>
          <button
            onClick={() => setQuery('Code')}
            className="px-2 py-0.5 rounded-md text-slate-400 hover:text-white"
          >
            Code
          </button>
          <button
            onClick={() => setQuery('URL')}
            className="px-2 py-0.5 rounded-md text-slate-400 hover:text-white"
          >
            URL
          </button>
          <button
            onClick={() => setQuery('Telemetry')}
            className="px-2 py-0.5 rounded-md text-slate-400 hover:text-white"
          >
            Telemetry
          </button>
          <button
            onClick={() => {
              onClose();
              if (onOpenShortcutsModal) onOpenShortcutsModal();
            }}
            className="ml-auto text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
          >
            <Keyboard className="w-3 h-3" />
            <span>Shortcuts (?)</span>
          </button>
        </div>

        <div ref={listRef} className="overflow-y-auto p-3 space-y-1 font-sans text-xs flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Search className="w-7 h-7 mx-auto text-slate-600 opacity-60" />
              <p className="text-xs">No matching tools, commands or projects found.</p>
              <p className="text-[10px] text-slate-500 font-mono">
                Try searching for &quot;analyzer&quot;, &quot;scan&quot;, or &quot;&gt;&quot; for commands.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between group transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600/35 via-cyan-500/20 to-transparent border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                      : 'hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : 'bg-black/40 border-white/10 text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold truncate ${
                            isSelected ? 'text-cyan-200' : 'text-slate-200'
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
                            {item.badge}
                          </span>
                        )}
                        {item.type === 'command' && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                            Command
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-md">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <kbd className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/15 text-[10px] font-mono text-cyan-300 font-bold shadow-inner">
                        {item.shortcut}
                      </kbd>
                    )}
                    <CornerDownLeft
                      className={`w-3.5 h-3.5 transition-all ${
                        isSelected ? 'text-cyan-400 opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-5 py-2.5 bg-black/50 border-t border-white/10 text-[10px] text-slate-400 font-mono flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white/10 rounded border border-white/15">↑</kbd>
              <kbd className="px-1 py-0.5 bg-white/10 rounded border border-white/15">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/15">↵ Enter</kbd>
              <span>to execute</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded border border-white/15">ESC</kbd> to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
