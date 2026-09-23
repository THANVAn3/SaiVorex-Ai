import React, { useState, useEffect } from 'react';
import { ActiveTab, CodeAnalysisResult, UrlScanResult, UserProfile, SecurityProject, SystemStatus } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { Dashboard } from './components/Dashboard';
import { ProjectsManager } from './components/ProjectsManager';
import { CodeAnalyzer } from './components/CodeAnalyzer';
import { UrlAuditor } from './components/UrlAuditor';
import { OwaspMatrix } from './components/OwaspMatrix';
import { PayloadPlayground } from './components/PayloadPlayground';
import { ReportGenerator } from './components/ReportGenerator';
import { LiveTelemetry } from './components/LiveTelemetry';
import { AiAgentsView } from './components/AiAgentsView';
import { Settings } from './components/Settings';
import { HelpDoc } from './components/HelpDoc';
import { AuthScreen } from './components/AuthScreen';
import { CocIntroPanel } from './components/CocIntroPanel';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { BreadcrumbNav } from './components/BreadcrumbNav';
import spaceEarthBg from './assets/images/space_earth_bg_1789977248857.jpg';
import cyberSocBg from './assets/images/cyber_soc_command_center_1789977745971.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [bgTheme, setBgTheme] = useState<'soc' | 'space'>('soc');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastAnalysisResult, setLastAnalysisResult] = useState<CodeAnalysisResult | null>(null);
  const [lastUrlResult, setLastUrlResult] = useState<UrlScanResult | null>(null);

  const [projects, setProjects] = useState<SecurityProject[]>([]);
  const [activeProject, setActiveProject] = useState<SecurityProject | null>(null);
  const [projectSubView, setProjectSubView] = useState<'upload' | 'projects' | 'details'>('upload');
  const [projectDetailsName, setProjectDetailsName] = useState<string | null>(null);
  const [projectSubViewOverride, setProjectSubViewOverride] = useState<'upload' | 'projects' | 'details' | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [hotkeyToast, setHotkeyToast] = useState<{ label: string; key: string } | null>(null);

  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('saivorex_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      }
    } catch {
    }
    return {
      name: 'Thanvan',
      email: 'thanvan328@gmail.com',
      organizationId: 'sathan',
      isLoggedIn: true,
      token: 'svx_token_thanvan_active',
    };
  });

  const [showIntro, setShowIntro] = useState<boolean>(false);

  const loadProjects = async () => {
    try {
      const token = currentUser?.token || '';
      const response = await fetch('/api/projects', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      if (Array.isArray(data.projects)) {
        setProjects(data.projects);
        if (data.projects.length > 0 && !activeProject) {
          setActiveProject(data.projects[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load projects from server:', err);
    }
  };

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('/api/system/status');
      const data = await response.json();
      setSystemStatus(data);
    } catch (err) {
      console.error('Failed to load system status:', err);
    }
  };

  useEffect(() => {
    if (currentUser?.isLoggedIn) {
      loadProjects();
      loadSystemStatus();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.token) {
      localStorage.setItem('saivorex_user', JSON.stringify(currentUser));
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      }).catch(() => {});
    } else if (currentUser) {
      localStorage.setItem('saivorex_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('saivorex_user');
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setShowIntro(true);
  };

  const handleLogout = () => {
    if (currentUser?.token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser.token}` },
      }).catch(() => {});
    }
    setCurrentUser(null);
    setShowIntro(false);
  };

  const showHotkeyFeedback = (label: string, key: string) => {
    setHotkeyToast({ label, key });
    setTimeout(() => {
      setHotkeyToast((curr) => (curr?.key === key ? null : curr));
    }, 1500);
  };

  const handleTriggerAction = (actionId: string) => {
    if (actionId === 'toggle-theme') {
      setBgTheme((prev) => (prev === 'soc' ? 'space' : 'soc'));
      showHotkeyFeedback('Theme Toggled', 'Ctrl+Shift+B');
    } else if (actionId === 'run-scan') {
      window.dispatchEvent(new CustomEvent('saivorex:run-scan'));
      showHotkeyFeedback('Run Security Scan', 'Ctrl+Enter');
    } else if (actionId === 'load-sqli') {
      setActiveTab('analyzer');
      setAuditPrefill({
        code: `// Vulnerable Authentication Query (SQL Injection)\nconst userId = req.body.userId;\nconst query = "SELECT * FROM users WHERE id = '" + userId + "' AND active = 1";\ndb.query(query, (err, rows) => {\n  if (err) throw err;\n  res.json(rows);\n});`,
        language: 'javascript',
        fileName: 'auth-sqli.js',
      });
      showHotkeyFeedback('Loaded SQL Injection Preset', 'Ctrl+Shift+1');
    } else if (actionId === 'load-xss') {
      setActiveTab('analyzer');
      setAuditPrefill({
        code: `// Vulnerable React Component (DOM XSS)\nexport function ProfileBio({ bioHtml }: { bioHtml: string }) {\n  return (\n    <div className="bio-container">\n      <h3>User Biography</h3>\n      <div dangerouslySetInnerHTML={{ __html: bioHtml }} />\n    </div>\n  );\n}`,
        language: 'typescript',
        fileName: 'ProfileBio.tsx',
      });
      showHotkeyFeedback('Loaded XSS Preset', 'Ctrl+Shift+2');
    } else if (actionId === 'load-ssrf') {
      setActiveTab('analyzer');
      setAuditPrefill({
        code: `// Vulnerable Cloud Metadata Fetcher (SSRF)\nconst targetUrl = req.query.url;\n// User input passed directly into internal HTTP client\nconst response = await fetch(targetUrl, { timeout: 3000 });\nconst data = await response.text();\nres.send(data);`,
        language: 'javascript',
        fileName: 'proxy-service.js',
      });
      showHotkeyFeedback('Loaded SSRF Preset', 'Ctrl+Shift+3');
    } else if (actionId === 'ping-gateway') {
      setActiveTab('telemetry');
      showHotkeyFeedback('Opening Live Telemetry', 'Ctrl+Shift+L');
    } else if (actionId === 'open-search') {
      setIsCommandPaletteOpen(true);
      showHotkeyFeedback('Search Omnibar', 'Ctrl+K');
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement | null;
      const isEditingText =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (isCtrlOrCmd && (e.key === 'k' || e.key === 'K' || e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        e.stopPropagation();
        setIsCommandPaletteOpen((prev) => !prev);
        showHotkeyFeedback('Command Palette Search', isCtrlOrCmd ? `Ctrl+${e.key.toUpperCase()}` : '/');
        return;
      }
      if (!isEditingText && e.key === '/') {
        e.preventDefault();
        e.stopPropagation();
        setIsCommandPaletteOpen(true);
        showHotkeyFeedback('Quick Search', '/');
        return;
      }

      if (
        (isCtrlOrCmd && (e.key === '?' || (e.shiftKey && e.key === '/'))) ||
        (!isEditingText && e.key === '?') ||
        e.key === 'F1'
      ) {
        e.preventDefault();
        e.stopPropagation();
        setIsShortcutsModalOpen((prev) => !prev);
        showHotkeyFeedback('Hotkeys Cheatsheet', 'Ctrl+?');
        return;
      }

      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsModalOpen(false);
        setIsMobileMenuOpen(false);
        return;
      }

      if (isCtrlOrCmd && e.shiftKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        e.stopPropagation();
        handleTriggerAction('toggle-theme');
        return;
      }

      if (isCtrlOrCmd && e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleTriggerAction('run-scan');
        return;
      }

      if (isCtrlOrCmd && e.shiftKey && (e.key === '1' || e.code === 'Digit1')) {
        e.preventDefault();
        e.stopPropagation();
        handleTriggerAction('load-sqli');
        return;
      }

      if (isCtrlOrCmd && e.shiftKey && (e.key === '2' || e.code === 'Digit2')) {
        e.preventDefault();
        e.stopPropagation();
        handleTriggerAction('load-xss');
        return;
      }

      if (isCtrlOrCmd && e.shiftKey && (e.key === '3' || e.code === 'Digit3')) {
        e.preventDefault();
        e.stopPropagation();
        handleTriggerAction('load-ssrf');
        return;
      }

      if (isCtrlOrCmd && e.shiftKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        e.stopPropagation();
        handleTriggerAction('ping-gateway');
        return;
      }

      if (isCtrlOrCmd && e.shiftKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        e.stopPropagation();
        setActiveTab('reports');
        showHotkeyFeedback('Reports Generator', 'Ctrl+Shift+E');
        return;
      }

      const isNavigationMod = isCtrlOrCmd || e.altKey;
      if (isNavigationMod && !e.shiftKey) {
        const tabMap: Record<string, { tab: ActiveTab; label: string }> = {
          '1': { tab: 'dashboard', label: 'Dashboard' },
          '2': { tab: 'analyzer', label: 'Code Auditor' },
          '3': { tab: 'urlaudit', label: 'URL Auditor' },
          '4': { tab: 'owasp', label: 'OWASP Matrix' },
          '5': { tab: 'payloads', label: 'Payload Lab' },
          '6': { tab: 'projects', label: 'Projects' },
          '7': { tab: 'reports', label: 'Audit Reports' },
          '8': { tab: 'telemetry', label: 'Network Telemetry' },
          '9': { tab: 'threatintel', label: 'Threat Intel' },
          '0': { tab: 'aiagents', label: 'Security Agents' },
          ',': { tab: 'settings', label: 'Settings' },
        };

        const targetNav = tabMap[e.key];
        if (targetNav) {
          e.preventDefault();
          e.stopPropagation();
          setActiveTab(targetNav.tab);
          showHotkeyFeedback(targetNav.label, `Ctrl+${e.key}`);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
  }, [currentUser]);

  const [auditPrefill, setAuditPrefill] = useState<{
    code: string;
    language: string;
    fileName?: string;
    result?: CodeAnalysisResult | null;
  } | null>(null);

  const handleCreateProject = async (name: string, description: string, targetType: any): Promise<SecurityProject | null> => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentUser?.token ? { Authorization: `Bearer ${currentUser.token}` } : {}),
        },
        body: JSON.stringify({ name, description, targetType }),
      });
      const data = await response.json();
      if (data.project) {
        setProjects((prev) => [data.project, ...prev]);
        setActiveProject(data.project);
        return data.project;
      }
      return null;
    } catch (err) {
      console.error('Failed to create project:', err);
      return null;
    }
  };

  const handleOpenInAnalyzer = (code: string, language: string, fileName?: string, result?: CodeAnalysisResult | null) => {
    setAuditPrefill({ code, language, fileName, result });
    setActiveTab('analyzer');
  };

  const handleDeleteProject = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: currentUser?.token ? { Authorization: `Bearer ${currentUser.token}` } : {},
      });
      
      setProjects((prev) => {
        const remaining = prev.filter((p) => p.id !== id);
        if (activeProject?.id === id) {
          setActiveProject(remaining.length > 0 ? remaining[0] : null);
        }
        return remaining;
      });
      return response.ok;
    } catch (err) {
      console.error('Failed to delete project:', err);
      setProjects((prev) => {
        const remaining = prev.filter((p) => p.id !== id);
        if (activeProject?.id === id) {
          setActiveProject(remaining.length > 0 ? remaining[0] : null);
        }
        return remaining;
      });
      return true;
    }
  };

  const handleAnalysisComplete = async (res: CodeAnalysisResult) => {
    setLastAnalysisResult(res);
    if (activeProject) {
      try {
        const response = await fetch(`/api/projects/${activeProject.id}/scans`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(currentUser?.token ? { Authorization: `Bearer ${currentUser.token}` } : {}),
          },
          body: JSON.stringify({ scanType: 'code', data: res }),
        });
        const data = await response.json();
        if (data.project) {
          setActiveProject(data.project);
          setProjects((prev) => prev.map((p) => (p.id === data.project.id ? data.project : p)));
        }
      } catch (err) {
        console.error('Failed to sync code scan to project:', err);
      }
    }
  };

  const handleUrlScanComplete = async (res: UrlScanResult) => {
    setLastUrlResult(res);
    if (activeProject) {
      try {
        const response = await fetch(`/api/projects/${activeProject.id}/scans`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(currentUser?.token ? { Authorization: `Bearer ${currentUser.token}` } : {}),
          },
          body: JSON.stringify({ scanType: 'url', data: res }),
        });
        const data = await response.json();
        if (data.project) {
          setActiveProject(data.project);
          setProjects((prev) => prev.map((p) => (p.id === data.project.id ? data.project : p)));
        }
      } catch (err) {
        console.error('Failed to sync URL scan to project:', err);
      }
    }
  };

  if (!currentUser || !currentUser.isLoggedIn) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  if (showIntro) {
    return (
      <CocIntroPanel
        userName={currentUser.name}
        onComplete={() => setShowIntro(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#040817] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white flex relative overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center transition-all duration-700 opacity-75 mix-blend-screen"
        style={{
          backgroundImage: `url(${bgTheme === 'soc' ? cyberSocBg : spaceEarthBg})`,
          backgroundPosition: bgTheme === 'soc' ? 'center center' : 'right 0% top -20px',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-tr from-[#040816]/95 via-[#060c20]/75 to-transparent" />
      <div className="fixed top-0 right-0 w-[850px] h-[500px] pointer-events-none z-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(6,182,212,0.22),_rgba(37,99,235,0.12),_transparent_70%)] blur-2xl" />
      <div className="fixed -bottom-32 -left-32 w-[550px] h-[550px] pointer-events-none z-0 bg-cyan-900/10 blur-[130px] rounded-full" />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(p) => setActiveProject(p)}
        onCreateProjectClick={() => setActiveTab('projects')}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isScanning={isScanning}
          currentUser={currentUser}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
          projects={projects}
          activeProject={activeProject}
          onSelectProject={(p) => setActiveProject(p)}
        />

        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={(tab) => setActiveTab(tab)}
          projects={projects}
          onSelectProject={(p) => setActiveProject(p)}
          onTriggerAction={handleTriggerAction}
          onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        />

        <KeyboardShortcutsModal
          isOpen={isShortcutsModalOpen}
          onClose={() => setIsShortcutsModalOpen(false)}
          onNavigate={(tab) => setActiveTab(tab)}
          onTriggerAction={handleTriggerAction}
        />

        <main className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <BreadcrumbNav
            activeTab={activeTab}
            onNavigate={(tab) => {
              setActiveTab(tab);
              if (tab === 'projects') {
                setProjectSubViewOverride('projects');
              }
            }}
            projects={projects}
            activeProject={activeProject}
            onSelectProject={(p) => setActiveProject(p)}
            subView={activeTab === 'projects' ? projectSubView : null}
            subViewLabel={
              activeTab === 'projects'
                ? projectSubView === 'details'
                  ? projectDetailsName || 'Project Details'
                  : projectSubView === 'projects'
                  ? 'Directory'
                  : 'Upload & Audit'
                : null
            }
            onSubViewClick={() => {
              if (activeTab === 'projects') {
                setProjectSubViewOverride('projects');
              }
            }}
            detailItemName={
              activeTab === 'analyzer' && auditPrefill?.fileName
                ? auditPrefill.fileName
                : activeTab === 'analyzer' && lastAnalysisResult
                ? 'Analysis Results'
                : activeTab === 'urlaudit' && lastUrlResult
                ? 'Audit Results'
                : null
            }
          />

          {activeTab === 'dashboard' && (
            <Dashboard
              currentUser={currentUser}
              projects={projects}
              activeProject={activeProject}
              onSelectProject={(p) => setActiveProject(p)}
              onNavigate={(tab) => setActiveTab(tab)}
              onCreateProjectClick={() => setActiveTab('projects')}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsManager
              projects={projects}
              activeProject={activeProject}
              onSelectProject={(p) => setActiveProject(p)}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenInAnalyzer={handleOpenInAnalyzer}
              onSubViewChange={(subView, detailName) => {
                setProjectSubView(subView);
                setProjectDetailsName(detailName || null);
              }}
              activeViewOverride={projectSubViewOverride}
            />
          )}

          {activeTab === 'analyzer' && (
            <CodeAnalyzer
              onScanStateChange={(scanning) => setIsScanning(scanning)}
              onAnalysisComplete={handleAnalysisComplete}
              initialCode={auditPrefill?.code}
              initialLanguage={auditPrefill?.language}
              initialFileName={auditPrefill?.fileName}
              initialResult={auditPrefill?.result}
            />
          )}

          {activeTab === 'urlaudit' && (
            <UrlAuditor
              onScanStateChange={(scanning) => setIsScanning(scanning)}
              onScanComplete={handleUrlScanComplete}
            />
          )}

          {activeTab === 'owasp' && <OwaspMatrix />}

          {activeTab === 'payloads' && <PayloadPlayground />}

          {activeTab === 'reports' && (
            <ReportGenerator
              lastResult={lastAnalysisResult}
              lastUrlResult={lastUrlResult}
            />
          )}

          {activeTab === 'telemetry' && (
            <LiveTelemetry
              initialMode="telemetry"
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'threatintel' && (
            <LiveTelemetry
              initialMode="threatintel"
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'aiagents' && <AiAgentsView />}

          {activeTab === 'settings' && (
            <Settings
              currentUser={currentUser}
              systemStatus={systemStatus}
              onUpdateUser={(updated) =>
                setCurrentUser((prev) => (prev ? { ...prev, ...updated } : prev))
              }
              onLogout={handleLogout}
            />
          )}

          {activeTab === 'help' && <HelpDoc />}
        </main>
      </div>

      {hotkeyToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#060c20]/95 backdrop-blur-2xl border border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.35)] text-xs font-mono text-white">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-300 font-sans font-medium">{hotkeyToast.label}</span>
            <kbd className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/20 text-cyan-300 font-bold">
              {hotkeyToast.key}
            </kbd>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30">
        <button
          onClick={() => setIsShortcutsModalOpen(true)}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#060c20]/80 hover:bg-[#081230] backdrop-blur-xl border border-white/10 hover:border-cyan-400/40 text-slate-400 hover:text-cyan-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all text-xs font-mono"
          title="Click to view Keyboard Shortcuts Cheatsheet (Ctrl + ?)"
        >
          <span className="text-cyan-400 text-xs">⌨</span>
          <span className="hidden sm:inline text-[11px] text-slate-300 group-hover:text-white">Hotkeys:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/15 text-[10px] text-cyan-300 font-bold">
            Ctrl + K
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/15 text-[10px] text-cyan-300 font-bold">
            Ctrl + ?
          </kbd>
        </button>
      </div>
    </div>
  );
}
