import React, { useState, useRef, useEffect } from 'react';
import { ActiveTab, SecurityProject } from '../types';
import {
  ChevronRight,
  Home,
  Folder,
  Code,
  Globe,
  AlertTriangle,
  Terminal,
  FileText,
  Activity,
  Radio,
  Bot,
  Settings,
  HelpCircle,
  Shield,
  Layers,
  ChevronDown,
  Check,
  Search
} from 'lucide-react';

export interface BreadcrumbSegment {
  id: string;
  label: string;
  icon?: React.ReactNode;
  tab?: ActiveTab;
  onClick?: () => void;
  isCurrent?: boolean;
  badge?: string;
  hasDropdown?: boolean;
}

interface BreadcrumbsProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  projects?: SecurityProject[];
  activeProject?: SecurityProject | null;
  onSelectProject?: (project: SecurityProject) => void;
  subView?: string | null;
  subViewLabel?: string | null;
  onSubViewClick?: () => void;
  detailItemName?: string | null;
  onDetailItemClick?: () => void;
}

const TAB_CONFIG: Record<ActiveTab, { label: string; icon: React.ReactNode; section: string }> = {
  dashboard: { label: 'Command Center', icon: <Home className="w-3.5 h-3.5 text-cyan-400" />, section: 'Overview' },
  projects: { label: 'Projects', icon: <Folder className="w-3.5 h-3.5 text-indigo-400" />, section: 'Workspace' },
  analyzer: { label: 'Code Auditor', icon: <Code className="w-3.5 h-3.5 text-cyan-400" />, section: 'SAST Audit' },
  urlaudit: { label: 'URL & Headers', icon: <Globe className="w-3.5 h-3.5 text-emerald-400" />, section: 'Perimeter' },
  owasp: { label: 'OWASP Top 10', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />, section: 'Standards' },
  payloads: { label: 'Payload Lab', icon: <Terminal className="w-3.5 h-3.5 text-purple-400" />, section: 'Testing' },
  reports: { label: 'Audit Reports', icon: <FileText className="w-3.5 h-3.5 text-cyan-400" />, section: 'Compliance' },
  telemetry: { label: 'Telemetry', icon: <Activity className="w-3.5 h-3.5 text-rose-400" />, section: 'Monitoring' },
  threatintel: { label: 'Threat Intel', icon: <Radio className="w-3.5 h-3.5 text-blue-400" />, section: 'Intelligence' },
  aiagents: { label: 'Security Agents', icon: <Bot className="w-3.5 h-3.5 text-indigo-400" />, section: 'Fleet' },
  settings: { label: 'Settings', icon: <Settings className="w-3.5 h-3.5 text-slate-400" />, section: 'System' },
  profile: { label: 'User Profile', icon: <Shield className="w-3.5 h-3.5 text-cyan-400" />, section: 'Identity' },
  help: { label: 'Documentation', icon: <HelpCircle className="w-3.5 h-3.5 text-slate-400" />, section: 'Knowledge' },
  showcase: { label: 'Platform Showcase', icon: <Layers className="w-3.5 h-3.5 text-cyan-400" />, section: 'Overview' },
};

export const BreadcrumbNav: React.FC<BreadcrumbsProps> = ({
  activeTab,
  onNavigate,
  projects = [],
  activeProject,
  onSelectProject,
  subView,
  subViewLabel,
  onSubViewClick,
  detailItemName,
  onDetailItemClick,
}) => {
  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
  const [isTabsDropdownOpen, setIsTabsDropdownOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  
  const projectsDropdownRef = useRef<HTMLDivElement>(null);
  const tabsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (projectsDropdownRef.current && !projectsDropdownRef.current.contains(e.target as Node)) {
        setIsProjectsDropdownOpen(false);
      }
      if (tabsDropdownRef.current && !tabsDropdownRef.current.contains(e.target as Node)) {
        setIsTabsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTabMeta = TAB_CONFIG[activeTab] || {
    label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
    icon: <Shield className="w-3.5 h-3.5 text-cyan-400" />,
    section: 'Workspace'
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.targetType.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const segments: BreadcrumbSegment[] = [];

  segments.push({
    id: 'root',
    label: 'Home',
    icon: <Home className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />,
    onClick: () => onNavigate('dashboard'),
  });

  if (activeTab !== 'dashboard') {
    segments.push({
      id: `tab-${activeTab}`,
      label: currentTabMeta.label,
      icon: currentTabMeta.icon,
      tab: activeTab,
      hasDropdown: true,
      onClick: () => {
        if (subView || detailItemName) {
          onNavigate(activeTab);
        }
      },
      isCurrent: !subView && !detailItemName && !(activeTab === 'projects' && activeProject),
    });
  }

  if (activeTab === 'projects') {
    if (activeProject) {
      segments.push({
        id: `proj-${activeProject.id}`,
        label: activeProject.name,
        icon: <Folder className="w-3.5 h-3.5 text-cyan-400" />,
        badge: activeProject.targetType.replace('_', ' '),
        hasDropdown: true,
        onClick: () => {
          if (subView || detailItemName) {
            onSubViewClick?.();
          }
        },
        isCurrent: !subView && !detailItemName,
      });
    }

    if (subViewLabel) {
      segments.push({
        id: `subview-${subView || 'detail'}`,
        label: subViewLabel,
        onClick: onSubViewClick,
        isCurrent: !detailItemName,
      });
    }

    if (detailItemName) {
      segments.push({
        id: 'detail-item',
        label: detailItemName,
        onClick: onDetailItemClick,
        isCurrent: true,
      });
    }
  } else if (activeTab === 'analyzer') {
    if (activeProject) {
      segments.push({
        id: `context-project`,
        label: activeProject.name,
        icon: <Folder className="w-3 h-3 text-slate-400" />,
        onClick: () => onNavigate('projects'),
      });
    }

    if (detailItemName) {
      segments.push({
        id: 'analyzer-detail',
        label: detailItemName,
        isCurrent: true,
      });
    }
  } else if (activeTab === 'urlaudit') {
    if (activeProject) {
      segments.push({
        id: `context-project`,
        label: activeProject.name,
        icon: <Folder className="w-3 h-3 text-slate-400" />,
        onClick: () => onNavigate('projects'),
      });
    }

    if (detailItemName) {
      segments.push({
        id: 'url-target',
        label: detailItemName,
        isCurrent: true,
      });
    }
  } else if (activeTab === 'reports') {
    if (activeProject) {
      segments.push({
        id: `context-project`,
        label: activeProject.name,
        icon: <Folder className="w-3 h-3 text-slate-400" />,
        onClick: () => onNavigate('projects'),
      });
    }

    if (detailItemName) {
      segments.push({
        id: 'report-name',
        label: detailItemName,
        isCurrent: true,
      });
    }
  } else {
    if (detailItemName) {
      segments.push({
        id: 'generic-detail',
        label: detailItemName,
        isCurrent: true,
      });
    }
  }

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="w-full flex items-center justify-between gap-3 px-3.5 py-2 mb-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.07] rounded-2xl backdrop-blur-xl shadow-[0_2px_15px_rgba(0,0,0,0.3)] transition-all text-xs font-mono select-none"
    >
      <ol className="flex items-center flex-wrap gap-1.5 min-w-0">
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;
          const isProjectSegment = seg.id.startsWith('proj-') || (seg.id === 'context-project' && !!onSelectProject);

          return (
            <li key={seg.id} className="flex items-center gap-1.5 min-w-0">
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 select-none" aria-hidden="true" />
              )}

              <div className="relative inline-flex items-center min-w-0">
                {isProjectSegment && projects.length > 0 ? (
                  <div className="relative" ref={projectsDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsProjectsDropdownOpen((prev) => !prev)}
                      className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all border ${
                        seg.isCurrent
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                          : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-slate-300 hover:text-white'
                      }`}
                      title="Switch project"
                    >
                      {seg.icon}
                      <span className="truncate max-w-[140px] sm:max-w-[200px]">{seg.label}</span>
                      {seg.badge && (
                        <span className="hidden md:inline-block px-1.5 py-0.2 rounded bg-black/40 text-[9px] uppercase tracking-wider text-slate-400 font-normal">
                          {seg.badge}
                        </span>
                      )}
                      <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-transform" />
                    </button>

                    {isProjectsDropdownOpen && (
                      <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-[#090f20]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-2 px-2.5 py-1.5 mb-1.5 bg-black/40 border border-white/10 rounded-xl text-xs">
                          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <input
                            type="text"
                            placeholder="Find project..."
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            className="w-full bg-transparent focus:outline-none text-xs text-slate-200 placeholder-slate-500"
                            autoFocus
                          />
                        </div>

                        <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                          {filteredProjects.length === 0 ? (
                            <div className="text-center py-4 text-xs text-slate-500">
                              No projects found
                            </div>
                          ) : (
                            filteredProjects.map((proj) => {
                              const isSelected = activeProject?.id === proj.id;
                              return (
                                <button
                                  key={proj.id}
                                  type="button"
                                  onClick={() => {
                                    onSelectProject?.(proj);
                                    setIsProjectsDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all ${
                                    isSelected
                                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                                      : 'hover:bg-white/[0.06] text-slate-300 hover:text-white border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                                    <div className="truncate">
                                      <div className="truncate font-semibold">{proj.name}</div>
                                      <div className="text-[10px] text-slate-500 uppercase">{proj.targetType.replace('_', ' ')}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className={`text-[10px] font-bold ${
                                      proj.securityScore >= 80 ? 'text-emerald-400' :
                                      proj.securityScore >= 60 ? 'text-amber-400' : 'text-red-400'
                                    }`}>
                                      {proj.securityScore}%
                                    </span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>

                        <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between px-2 text-[10px] text-slate-400">
                          <span>{projects.length} Total Projects</span>
                          <button
                            type="button"
                            onClick={() => {
                              onNavigate('projects');
                              setIsProjectsDropdownOpen(false);
                            }}
                            className="text-cyan-400 hover:underline font-bold"
                          >
                            Manage All &rarr;
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : seg.hasDropdown && seg.tab ? (
                  <div className="relative" ref={tabsDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsTabsDropdownOpen((prev) => !prev)}
                      className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all border ${
                        seg.isCurrent
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                          : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-slate-300 hover:text-white'
                      }`}
                      title="Quick jump to tool"
                    >
                      {seg.icon}
                      <span className="truncate max-w-[130px] sm:max-w-[170px]">{seg.label}</span>
                      <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-transform" />
                    </button>

                    {isTabsDropdownOpen && (
                      <div className="absolute left-0 top-full mt-2 w-64 bg-[#090f20]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1 tracking-wider border-b border-white/10 mb-1">
                          Workspace Sections
                        </div>
                        <div className="space-y-0.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                          {(Object.keys(TAB_CONFIG) as ActiveTab[]).map((tabKey) => {
                            const info = TAB_CONFIG[tabKey];
                            const isCurrentTab = tabKey === activeTab;
                            return (
                              <button
                                key={tabKey}
                                type="button"
                                onClick={() => {
                                  onNavigate(tabKey);
                                  setIsTabsDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left text-xs transition-all ${
                                  isCurrentTab
                                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                                }`}
                              >
                                <span className="p-1 rounded-lg bg-black/40 border border-white/10">{info.icon}</span>
                                <span className="flex-1 truncate">{info.label}</span>
                                {isCurrentTab && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : seg.onClick && !isLast ? (
                  <button
                    type="button"
                    onClick={seg.onClick}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-slate-300 hover:text-white transition-all group"
                  >
                    {seg.icon}
                    <span className="truncate max-w-[140px] sm:max-w-[200px]">{seg.label}</span>
                  </button>
                ) : (
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${
                      isLast
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 font-bold shadow-[0_0_12px_rgba(6,182,212,0.12)]'
                        : 'bg-white/[0.03] border-white/10 text-slate-300'
                    }`}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {seg.icon}
                    <span className="truncate max-w-[150px] sm:max-w-[260px]">{seg.label}</span>
                    {seg.badge && (
                      <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/40 text-[9px] uppercase tracking-wider text-slate-400 font-normal">
                        {seg.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="hidden md:flex items-center gap-2 shrink-0 text-[11px] text-slate-400">
        {activeProject ? (
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Active Scope:</span>
            <span className="text-slate-200 font-semibold max-w-[130px] truncate" title={activeProject.name}>
              {activeProject.name}
            </span>
            <span className={`w-2 h-2 rounded-full ${
              activeProject.securityScore >= 80 ? 'bg-emerald-400' :
              activeProject.securityScore >= 60 ? 'bg-amber-400' : 'bg-red-400'
            }`} />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 pl-3 border-l border-white/10 text-slate-500 text-[10px] uppercase tracking-wider">
            <span>SaiVorex Workspace</span>
          </div>
        )}
      </div>
    </nav>
  );
};
