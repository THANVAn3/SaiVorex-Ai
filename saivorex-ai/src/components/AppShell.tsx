import React, { useState } from 'react';
import { ActiveTab, UserProfile, SecurityProject } from '../types';
import {
  Shield,
  LayoutDashboard,
  FolderKanban,
  Code,
  Globe,
  AlertTriangle,
  Terminal,
  FileText,
  Activity,
  Settings,
  User,
  HelpCircle,
  LogOut,
  Search,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Command,
  Plus
} from 'lucide-react';

interface AppShellProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  currentProject: SecurityProject | null;
  projects: SecurityProject[];
  onSelectProject: (p: SecurityProject) => void;
  onLogout: () => void;
  onOpenCommandPalette: () => void;
  isScanning: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  currentProject,
  projects,
  onSelectProject,
  onLogout,
  onOpenCommandPalette,
  isScanning,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState<boolean>(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);

  const navItems: { id: ActiveTab; label: string; category: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Command Center', category: 'OVERVIEW', icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" /> },
    { id: 'projects', label: 'Projects Workspace', category: 'OVERVIEW', icon: <FolderKanban className="w-4 h-4 text-cyan-400" /> },
    
    { id: 'analyzer', label: 'Code SAST Auditor', category: 'AUDIT TOOLS', icon: <Code className="w-4 h-4 text-cyan-400" /> },
    { id: 'urlaudit', label: 'Header Auditor', category: 'AUDIT TOOLS', icon: <Globe className="w-4 h-4 text-emerald-400" /> },
    { id: 'owasp', label: 'OWASP Top 10', category: 'AUDIT TOOLS', icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
    { id: 'payloads', label: 'Payload Laboratory', category: 'AUDIT TOOLS', icon: <Terminal className="w-4 h-4 text-purple-400" /> },
    
    { id: 'reports', label: 'Audit Reports', category: 'INTELLIGENCE', icon: <FileText className="w-4 h-4 text-blue-400" /> },
    { id: 'telemetry', label: 'Live Telemetry', category: 'INTELLIGENCE', icon: <Activity className="w-4 h-4 text-cyan-400" /> },
    
    { id: 'settings', label: 'Settings & Status', category: 'SYSTEM', icon: <Settings className="w-4 h-4 text-slate-400" /> },
    { id: 'profile', label: 'User Account', category: 'SYSTEM', icon: <User className="w-4 h-4 text-slate-400" /> },
    { id: 'help', label: 'Help & Documentation', category: 'SYSTEM', icon: <HelpCircle className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-white">
      <header className="sticky top-0 z-40 bg-[#080B14]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
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
                  }
                }}
                className="w-7 h-7 object-contain relative z-10 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex items-center gap-1.5 font-mono font-bold text-base tracking-tight text-white">
              <span>SaiVorex</span>
              <span className="text-cyan-400">AI</span>
            </div>
          </div>

          {currentProject && (
            <div className="relative hidden md:block border-l border-slate-800 pl-3 ml-2">
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-xs font-mono text-slate-200 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="font-bold max-w-[140px] truncate">{currentProject.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showProjectDropdown && (
                <div className="absolute left-3 mt-2 w-64 bg-[#0D121F] border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 font-mono text-xs">
                  <div className="text-[10px] text-slate-500 uppercase px-2.5 py-1 font-bold">
                    SELECT SECURITY PROJECT
                  </div>
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p);
                        setShowProjectDropdown(false);
                      }}
                      className={`p-2 rounded-xl cursor-pointer flex items-center justify-between ${
                        currentProject.id === p.id ? 'bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-bold' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-500">{p.securityScore}/100</span>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setActiveTab('projects');
                      setShowProjectDropdown(false);
                    }}
                    className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-cyan-400 font-bold text-[11px] flex items-center justify-center gap-1 mt-1 border border-slate-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Manage Projects Workspace</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-3 px-3 py-1.5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 transition-all shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search modules or projects...</span>
            <span className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-cyan-300 font-bold font-mono">
              Ctrl + K / F
            </span>
          </button>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 rounded-full text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>SYSTEM ACTIVE</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-1.5 px-2.5 rounded-full transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-bold text-[10px]">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-mono text-slate-200 hidden sm:inline max-w-[80px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0D121F] border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 z-50 font-mono text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-xl space-y-1">
                  <div className="font-bold text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                  <div className="text-[10px] text-amber-400">ORG: {currentUser.organizationId}</div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>My Account Profile</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>System Settings</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-bold border-t border-slate-800 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside
          className={`hidden lg:flex flex-col border-r border-slate-800/80 bg-[#080B14] transition-all duration-300 shrink-0 ${
            sidebarCollapsed ? 'w-16' : 'w-60'
          }`}
        >
          <div className="flex-1 overflow-y-auto p-3 space-y-6">
            {['OVERVIEW', 'AUDIT TOOLS', 'INTELLIGENCE', 'SYSTEM'].map((category) => {
              const categoryItems = navItems.filter((i) => i.category === category);
              return (
                <div key={category} className="space-y-1">
                  {!sidebarCollapsed && (
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase px-3 block tracking-wider">
                      {category}
                    </span>
                  )}
                  {categoryItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono transition-all font-bold ${
                          isActive
                            ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-md shadow-cyan-950/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        {item.icon}
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {!sidebarCollapsed && (
            <div className="p-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>SaiVorex Engine</span>
                <span className="text-cyan-400 font-bold">v2.5</span>
              </div>
              <p className="text-[9px]">OWASP Top 10 Aligned SAST</p>
            </div>
          )}
        </aside>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm flex">
            <div className="w-72 bg-[#080B14] border-r border-slate-800 p-4 space-y-6 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 font-mono font-bold text-white">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <span>SaiVorex Navigation</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {['OVERVIEW', 'AUDIT TOOLS', 'INTELLIGENCE', 'SYSTEM'].map((category) => (
                    <div key={category} className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2 block">
                        {category}
                      </span>
                      {navItems
                        .filter((i) => i.category === category)
                        .map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono font-bold text-left ${
                              activeTab === item.id ? 'bg-cyan-950 border border-cyan-800 text-cyan-300' : 'text-slate-400'
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>LOG OUT</span>
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      <nav className="lg:hidden sticky bottom-0 z-40 bg-[#080B14]/95 border-t border-slate-800 px-2 py-1.5 flex items-center justify-around font-mono text-[9px]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Center</span>
        </button>

        <button
          onClick={() => setActiveTab('analyzer')}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'analyzer' ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}
        >
          <Code className="w-4 h-4" />
          <span>Code</span>
        </button>

        <button
          onClick={() => setActiveTab('urlaudit')}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'urlaudit' ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}
        >
          <Globe className="w-4 h-4" />
          <span>URL</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'reports' ? 'text-blue-400 font-bold' : 'text-slate-500'}`}
        >
          <FileText className="w-4 h-4" />
          <span>Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'telemetry' ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}
        >
          <Activity className="w-4 h-4" />
          <span>Telemetry</span>
        </button>
      </nav>
    </div>
  );
};
