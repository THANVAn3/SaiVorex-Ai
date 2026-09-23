import React, { useState, useRef } from 'react';
import { ActiveTab, SecurityProject, CodeAnalysisResult, Severity } from '../types';
import { CODE_SAMPLE_PRESETS } from '../data/presets';
import {
  Folder,
  Plus,
  Search,
  Filter,
  Trash2,
  ArrowRight,
  Shield,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  AlertOctagon,
  X,
  UploadCloud,
  FileCode,
  Play,
  Sparkles,
  Check,
  Copy,
  FileText,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Clock,
  ArrowLeft,
  Calendar,
  Globe
} from 'lucide-react';
import { ProjectTimeline } from './ProjectTimeline';

interface ProjectsManagerProps {
  projects: SecurityProject[];
  activeProject: SecurityProject | null;
  onSelectProject: (project: SecurityProject) => void;
  onCreateProject: (name: string, description: string, targetType: any) => Promise<SecurityProject | null>;
  onDeleteProject: (id: string) => Promise<boolean | void>;
  onNavigate: (tab: ActiveTab) => void;
  onOpenInAnalyzer?: (code: string, language: string, fileName?: string, result?: CodeAnalysisResult | null) => void;
  isCreateOpenInitially?: boolean;
  onSubViewChange?: (subView: 'upload' | 'projects' | 'details', projectDetailsName?: string | null) => void;
  activeViewOverride?: 'upload' | 'projects' | 'details' | null;
}

export function detectLanguageFromFilename(filename: string): { language: string; platformId: string } {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'py':
    case 'pyw':
      return { language: 'Python', platformId: 'python' };
    case 'js':
    case 'mjs':
    case 'cjs':
    case 'jsx':
      return { language: 'JavaScript', platformId: 'javascript' };
    case 'ts':
    case 'tsx':
      return { language: 'TypeScript', platformId: 'typescript' };
    case 'c':
    case 'h':
      return { language: 'C', platformId: 'c' };
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'hpp':
    case 'hxx':
      return { language: 'C++', platformId: 'cpp' };
    case 'java':
      return { language: 'Java', platformId: 'java' };
    case 'cs':
      return { language: 'C#', platformId: 'csharp' };
    case 'go':
      return { language: 'Go', platformId: 'go' };
    case 'rs':
      return { language: 'Rust', platformId: 'rust' };
    case 'php':
      return { language: 'PHP', platformId: 'php' };
    case 'rb':
      return { language: 'Ruby', platformId: 'ruby' };
    case 'sql':
      return { language: 'SQL', platformId: 'sql' };
    case 'sol':
      return { language: 'Solidity', platformId: 'solidity' };
    case 'sh':
    case 'bash':
      return { language: 'Shell Script', platformId: 'nodejs' };
    case 'json':
      return { language: 'JSON', platformId: 'javascript' };
    case 'yaml':
    case 'yml':
      return { language: 'YAML', platformId: 'python' };
    case 'html':
    case 'htm':
      return { language: 'HTML', platformId: 'javascript' };
    default:
      return { language: 'Source Code', platformId: 'javascript' };
  }
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onNavigate,
  onOpenInAnalyzer,
  isCreateOpenInitially = false,
  onSubViewChange,
  activeViewOverride,
}: ProjectsManagerProps) => {
  const [activeView, setActiveView] = useState<'upload' | 'projects' | 'details'>(activeViewOverride || 'upload');
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<SecurityProject | null>(activeProject || (projects.length > 0 ? projects[0] : null));

  React.useEffect(() => {
    if (activeViewOverride && activeViewOverride !== activeView) {
      setActiveView(activeViewOverride);
    }
  }, [activeViewOverride]);

  React.useEffect(() => {
    onSubViewChange?.(activeView, activeView === 'details' ? selectedProjectForDetails?.name : null);
  }, [activeView, selectedProjectForDetails, onSubViewChange]);

  const handleOpenProjectDetails = (project: SecurityProject) => {
    setSelectedProjectForDetails(project);
    setActiveView('details');
  };
  
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<number>(0);
  const [uploadedFileCode, setUploadedFileCode] = useState<string>('');
  const [detectedLanguage, setDetectedLanguage] = useState<string>('python');
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [targetType, setTargetType] = useState<'web_app' | 'source_code' | 'api_gateway' | 'network' | 'full_suite'>('source_code');
  
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditStep, setAuditStep] = useState<number>(0);
  const [auditResult, setAuditResult] = useState<CodeAnalysisResult | null>(null);
  const [createdProjectForAudit, setCreatedProjectForAudit] = useState<SecurityProject | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [copiedRemediated, setCopiedRemediated] = useState<boolean>(false);
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(isCreateOpenInitially);

  const [projectToDelete, setProjectToDelete] = useState<SecurityProject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleFileChange = (file: File) => {
    const { language, platformId } = detectLanguageFromFilename(file.name);
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const formattedProjectName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    setUploadedFileName(file.name);
    setUploadedFileSize(file.size);
    setDetectedLanguage(platformId);
    setProjectName(formattedProjectName || `Audit Project (${file.name})`);
    setProjectDescription(`Security vulnerability audit of source file: ${file.name}`);
    setAuditResult(null);
    setAuditError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setUploadedFileCode(content || '');
    };
    reader.readAsText(file);
  };

  const handleLoadSampleFile = (presetId: string) => {
    const preset = CODE_SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const extMap: Record<string, string> = {
        python: 'py',
        javascript: 'js',
        c: 'c',
        cpp: 'cpp',
        java: 'java',
        php: 'php',
      };
      const ext = extMap[preset.language.toLowerCase()] || 'txt';
      const fakeFileName = `${preset.id.replace(/-/g, '_')}.${ext}`;
      
      setUploadedFileName(fakeFileName);
      setUploadedFileSize(new Blob([preset.code]).size);
      setDetectedLanguage(preset.language.toLowerCase());
      setProjectName(preset.title);
      setProjectDescription(preset.description);
      setUploadedFileCode(preset.code);
      setAuditResult(null);
      setAuditError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUploadAndAudit = async () => {
    if (!uploadedFileCode.trim()) {
      setAuditError('Please select or upload a code file before auditing.');
      return;
    }

    setIsAuditing(true);
    setAuditStep(1);
    setAuditError(null);
    setAuditResult(null);

    try {
      setAuditStep(2);
      const proj = await onCreateProject(
        projectName.trim() || `Security Audit - ${uploadedFileName || 'Source File'}`,
        projectDescription.trim() || `Security audit of uploaded source code`,
        targetType
      );

      if (proj) {
        setCreatedProjectForAudit(proj);
        onSelectProject(proj);
      }

      setAuditStep(3);
      const response = await fetch('/api/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: uploadedFileCode,
          language: detectedLanguage,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to complete security audit.');
      }

      const scanData: CodeAnalysisResult = await response.json();
      
      setAuditStep(4);
      if (proj?.id) {
        await fetch(`/api/projects/${proj.id}/scans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scanType: 'code', data: scanData }),
        }).catch(() => {});
      }

      setAuditResult(scanData);
      showToast(`Audit completed! Found ${scanData.totalVulnerabilities} vulnerabilities.`);
    } catch (err: any) {
      console.error('Audit failed:', err);
      setAuditError(err.message || 'An error occurred during security auditing.');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const deletedName = projectToDelete.name;
      await onDeleteProject(projectToDelete.id);
      setProjectToDelete(null);
      showToast(`Project "${deletedName}" has been permanently deleted.`);
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-950/80 text-red-400 border-red-800/80';
      case 'HIGH':
        return 'bg-rose-950/80 text-rose-400 border-rose-800/80';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/80';
      case 'LOW':
        return 'bg-blue-950/80 text-blue-400 border-blue-800/80';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || p.targetType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200 relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0D1527] border border-cyan-500/50 text-cyan-200 px-4 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Folder className="w-6 h-6 text-cyan-400" />
            <span>Security Project Upload & Audit Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload your source code files, auto-detect architecture vulnerabilities, and generate verified security audit workspaces.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0D1322] border border-slate-800 p-1.5 rounded-2xl shrink-0 text-xs font-mono">
          <button
            onClick={() => setActiveView('upload')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${
              activeView === 'upload'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload & Audit</span>
          </button>

          <button
            onClick={() => setActiveView('projects')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${
              activeView === 'projects'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>All Projects ({projects.length})</span>
          </button>

          {selectedProjectForDetails && (
            <button
              onClick={() => setActiveView('details')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${
                activeView === 'details'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="max-w-[150px] truncate">{selectedProjectForDetails.name} Details</span>
            </button>
          )}
        </div>
      </div>

      {activeView === 'upload' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer relative overflow-hidden group ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
                    : uploadedFileCode
                    ? 'border-cyan-500/50 bg-[#0D1527]/70'
                    : 'border-slate-800 hover:border-slate-700 bg-[#0D1322]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                  accept=".py,.js,.jsx,.ts,.tsx,.c,.cpp,.h,.hpp,.java,.cs,.go,.rs,.php,.rb,.sql,.sol,.json,.yaml,.yml,.xml,.html,.sh,.txt"
                />

                <div className="space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:border-cyan-400 transition-all shadow-lg shadow-cyan-500/10">
                    <UploadCloud className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-white text-base font-mono">
                      {uploadedFileName ? 'Uploaded File Loaded' : 'Drag & Drop Code File to Audit'}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {uploadedFileName
                        ? `Ready to scan ${uploadedFileName} (${(uploadedFileSize / 1024).toFixed(1)} KB)`
                        : 'Drop your Python, JavaScript, TypeScript, C/C++, Java, Go, Rust, PHP, or Solidity file here, or click to browse.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 rounded-full">
                      .py
                    </span>
                    <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 rounded-full">
                      .js / .ts
                    </span>
                    <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 rounded-full">
                      .c / .cpp
                    </span>
                    <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 rounded-full">
                      .java
                    </span>
                    <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 rounded-full">
                      +10 more
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D1322] border border-slate-800 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Quick Vulnerable Test Files</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1-click test audit</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => handleLoadSampleFile('sqli-python')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 rounded-xl transition-all"
                  >
                    🐍 Flask SQLi (.py)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSampleFile('buffer-overflow-c')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-blue-300 rounded-xl transition-all"
                  >
                    ⚙️ Buffer Overflow (.c)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSampleFile('cmd-injection-node')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 rounded-xl transition-all"
                  >
                    🟢 Node.js Cmd Exec (.js)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSampleFile('deserialization-java')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-orange-500/40 text-slate-300 hover:text-orange-300 rounded-xl transition-all"
                  >
                    ☕ Java Deserializer (.java)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadSampleFile('path-traversal-php')}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 rounded-xl transition-all"
                  >
                    🌐 PHP Path Traversal (.php)
                  </button>
                </div>
              </div>

              {uploadedFileCode && (
                <div className="bg-[#0D1322] border border-slate-800 rounded-2xl overflow-hidden space-y-0">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-300">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold">{uploadedFileName || 'source_payload.txt'}</span>
                      <span className="text-[10px] text-slate-500">({uploadedFileCode.split('\n').length} lines)</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                      {detectedLanguage}
                    </span>
                  </div>
                  <div className="p-4 max-h-64 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed scrollbar-thin">
                    <pre className="overflow-x-auto whitespace-pre">
                      {uploadedFileCode.split('\n').map((line, idx) => (
                        <div key={idx} className="table-row">
                          <span className="table-cell pr-4 text-slate-600 select-none text-right w-8 text-[11px]">
                            {idx + 1}
                          </span>
                          <span className="table-cell">{line}</span>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#0D1322] border border-slate-800 rounded-3xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <h3 className="font-bold text-white text-sm font-mono flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <span>Project & Audit Parameters</span>
                  </h3>
                  {uploadedFileName && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Ready
                    </span>
                  )}
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">Security Project Name *</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="e.g., E-Commerce Auth Microservice"
                      className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">Audit Scope / Notes</label>
                    <textarea
                      rows={2}
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="e.g., Critical backend authentication and database transaction layer."
                      className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">Target Architecture Type</label>
                    <select
                      value={targetType}
                      onChange={(e) => setTargetType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="source_code">Source Code Repository / SAST</option>
                      <option value="web_app">Web Application / Single Page App</option>
                      <option value="api_gateway">REST / GraphQL API Gateway</option>
                      <option value="network">Network Subnet & Telemetry Target</option>
                      <option value="full_suite">Full Stack Multi-Vector Suite</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">Analysis Engine Engine Target</label>
                    <select
                      value={detectedLanguage}
                      onChange={(e) => setDetectedLanguage(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-cyan-500/50 uppercase"
                    >
                      <option value="python">Python (Flask / FastAPI / Django)</option>
                      <option value="javascript">JavaScript (Node / Express / Browser)</option>
                      <option value="typescript">TypeScript (Nest / Next.js)</option>
                      <option value="c">C (Systems / Embedded)</option>
                      <option value="cpp">C++ (Memory & Object Oriented)</option>
                      <option value="java">Java (Spring Boot / Enterprise)</option>
                      <option value="csharp">C# (.NET / ASP.NET)</option>
                      <option value="go">Go (Golang Microservices)</option>
                      <option value="rust">Rust (Memory Safe Systems)</option>
                      <option value="php">PHP (Laravel / Core)</option>
                      <option value="ruby">Ruby (Rails / Sinatra)</option>
                      <option value="sql">SQL (Query Procedures)</option>
                    </select>
                  </div>
                </div>

                {auditError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-mono flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                    <span>{auditError}</span>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    disabled={isAuditing || !uploadedFileCode.trim()}
                    onClick={handleUploadAndAudit}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-cyan-500/20 active:scale-98 disabled:opacity-50"
                  >
                    {isAuditing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Running SaiVorex SAST Audit...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-slate-950 stroke-[2]" />
                        <span>Upload & Run Security Audit</span>
                      </>
                    )}
                  </button>

                  {uploadedFileCode && (
                    <button
                      type="button"
                      disabled={isAuditing}
                      onClick={() => {
                        setUploadedFileName('');
                        setUploadedFileCode('');
                        setProjectName('');
                        setProjectDescription('');
                        setAuditResult(null);
                        setAuditError(null);
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono transition-all"
                    >
                      Clear File & Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isAuditing && (
            <div className="bg-[#0D1322] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-950/30 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400 animate-pulse">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base font-mono">
                      SaiVorex Deep Security Inspection
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Auditing {uploadedFileName || 'source file'} across OWASP Top 10 vectors & memory flaws
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-cyan-400 font-bold">Scanning...</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className={`p-3 rounded-2xl border ${auditStep >= 1 ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {auditStep > 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
                    <span>1. Ingest Payload</span>
                  </div>
                  <span className="text-[10px] text-slate-400">AST parsing & tokenization</span>
                </div>

                <div className={`p-3 rounded-2xl border ${auditStep >= 2 ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {auditStep > 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : auditStep === 2 ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" /> : <span className="w-3.5 h-3.5" />}
                    <span>2. Workspace Sync</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Project DB provisioning</span>
                </div>

                <div className={`p-3 rounded-2xl border ${auditStep >= 3 ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {auditStep > 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : auditStep === 3 ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" /> : <span className="w-3.5 h-3.5" />}
                    <span>3. SAST Security Engine</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Deep AST syntax analysis</span>
                </div>

                <div className={`p-3 rounded-2xl border ${auditStep >= 4 ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {auditStep >= 4 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <span className="w-3.5 h-3.5" />}
                    <span>4. Threat Report</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Remediation synthesis</span>
                </div>
              </div>
            </div>
          )}

          {auditResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#0D1322] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center font-mono shrink-0 shadow-lg ${
                      auditResult.securityScore >= 80
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                        : auditResult.securityScore >= 60
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-400'
                        : 'bg-red-950/40 border-red-500/50 text-red-400'
                    }`}>
                      <span className="text-2xl font-black">{auditResult.securityScore}</span>
                      <span className="text-[9px] uppercase tracking-wider">/ 100</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white font-mono">
                          Audit Completed: {projectName || uploadedFileName}
                        </h2>
                        <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full">
                          SAVED TO PROJECTS
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-2xl">
                        {auditResult.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <button
                      onClick={() => {
                        if (onOpenInAnalyzer) {
                          onOpenInAnalyzer(uploadedFileCode, detectedLanguage, uploadedFileName, auditResult);
                        } else {
                          onNavigate('analyzer');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Open in Code Analyzer</span>
                    </button>

                    <button
                      onClick={() => onNavigate('reports')}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-2 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
                  <div className="bg-red-950/30 border border-red-900/40 p-3 rounded-2xl flex items-center justify-between">
                    <span className="text-slate-400 uppercase text-[10px]">Critical</span>
                    <span className="text-base font-extrabold text-red-400">{auditResult.severityCounts.CRITICAL || 0}</span>
                  </div>
                  <div className="bg-rose-950/30 border border-rose-900/40 p-3 rounded-2xl flex items-center justify-between">
                    <span className="text-slate-400 uppercase text-[10px]">High</span>
                    <span className="text-base font-extrabold text-rose-400">{auditResult.severityCounts.HIGH || 0}</span>
                  </div>
                  <div className="bg-amber-950/30 border border-amber-900/40 p-3 rounded-2xl flex items-center justify-between">
                    <span className="text-slate-400 uppercase text-[10px]">Medium</span>
                    <span className="text-base font-extrabold text-amber-400">{auditResult.severityCounts.MEDIUM || 0}</span>
                  </div>
                  <div className="bg-blue-950/30 border border-blue-900/40 p-3 rounded-2xl flex items-center justify-between">
                    <span className="text-slate-400 uppercase text-[10px]">Low</span>
                    <span className="text-base font-extrabold text-blue-400">{auditResult.severityCounts.LOW || 0}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center justify-between col-span-2 sm:col-span-1">
                    <span className="text-slate-400 uppercase text-[10px]">Total Issues</span>
                    <span className="text-base font-extrabold text-cyan-400">{auditResult.totalVulnerabilities}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white font-mono text-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-cyan-400" />
                    <span>Identified Vulnerabilities & Exploit Proofs ({auditResult.findings.length})</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {auditResult.findings.map((finding) => {
                    const isExpanded = expandedFindingId === finding.id;
                    return (
                      <div
                        key={finding.id}
                        className="bg-[#0D1322] border border-slate-800 rounded-2xl overflow-hidden transition-all"
                      >
                        <div
                          onClick={() => setExpandedFindingId(isExpanded ? null : finding.id)}
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border shrink-0 ${getSeverityBadge(finding.severity)}`}>
                              {finding.severity}
                            </span>
                            <span className="font-bold text-slate-200 text-xs font-mono truncate">
                              {finding.title}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
                              [{finding.cwe}]
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                            <span className="text-slate-400 text-[11px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                              Line {finding.lineRange[0]} - {finding.lineRange[1]}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 space-y-4 text-xs font-mono animate-in fade-in duration-150">
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-500 uppercase font-bold">Vulnerability Description</span>
                              <p className="text-slate-300 font-sans leading-relaxed">{finding.description}</p>
                            </div>

                            <div className="space-y-1 bg-red-950/20 border border-red-900/30 p-3 rounded-xl">
                              <span className="text-[10px] text-red-400 uppercase font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Exploit Vector / Scenario
                              </span>
                              <p className="text-slate-300 font-sans leading-relaxed">{finding.exploitScenario}</p>
                            </div>

                            <div className="space-y-1 bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-xl">
                              <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Recommended Remediation
                              </span>
                              <p className="text-slate-300 font-sans leading-relaxed">{finding.remediation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {auditResult.remediatedCode && (
                <div className="bg-[#0D1322] border border-slate-800 rounded-3xl overflow-hidden space-y-0">
                  <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800 text-xs font-mono">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Refactored & Sanitized Source Code (Defensive Patch)</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(auditResult.remediatedCode);
                        setCopiedRemediated(true);
                        setTimeout(() => setCopiedRemediated(false), 2000);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all"
                    >
                      {copiedRemediated ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRemediated ? 'Copied' : 'Copy Remediated Code'}</span>
                    </button>
                  </div>

                  <div className="p-5 max-h-80 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950 leading-relaxed scrollbar-thin">
                    <pre className="overflow-x-auto whitespace-pre">{auditResult.remediatedCode}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeView === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D1322] border border-slate-800 p-3 rounded-2xl">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects by name, target, description..."
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs font-mono">
              <Filter className="w-4 h-4 text-slate-500 shrink-0" />
              {['ALL', 'web_app', 'source_code', 'api_gateway', 'network'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-xl uppercase font-semibold whitespace-nowrap transition-all ${
                    typeFilter === type
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  {type === 'ALL' ? 'All Types' : type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <Folder className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base font-mono">No Security Projects Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchTerm ? 'No projects match your search query.' : 'Upload your first code file or create a project to organize scans.'}
                </p>
              </div>
              <button
                onClick={() => setActiveView('upload')}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase inline-flex items-center gap-2 hover:bg-cyan-400 transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload & Audit File Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const isSelected = activeProject?.id === project.id;
                return (
                  <div
                    key={project.id}
                    className={`bg-[#0D1322] border rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:border-cyan-500/50 ${
                      isSelected ? 'border-cyan-500/80 ring-1 ring-cyan-500/30 bg-[#0F172A]' : 'border-slate-800'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div
                          onClick={() => handleOpenProjectDetails(project)}
                          className="flex items-center gap-2 cursor-pointer group/title"
                          title="Click to view Project Details & Security Lifecycle Timeline"
                        >
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            project.securityScore >= 80 ? 'bg-emerald-400' :
                            project.securityScore >= 60 ? 'bg-amber-400' : 'bg-red-400'
                          }`} />
                          <h3 className="font-bold text-sm text-slate-100 group-hover/title:text-cyan-300 transition-colors font-mono line-clamp-1">
                            {project.name}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono uppercase bg-slate-800 text-cyan-400 border border-slate-700 px-2 py-0.5 rounded shrink-0">
                          {project.targetType.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">{project.description}</p>

                      <div className="flex items-center justify-between text-xs font-mono bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Health Score</span>
                          <span className={`font-bold text-sm ${
                            project.securityScore >= 80 ? 'text-emerald-400' :
                            project.securityScore >= 60 ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {project.securityScore} / 100
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block uppercase">Vulnerabilities</span>
                          <span className="text-slate-200 font-bold text-xs">
                            {project.criticalCount + project.highCount + project.mediumCount} Issues
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onSelectProject(project);
                            onNavigate('analyzer');
                          }}
                          className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all font-semibold ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400'
                              : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          <span>{isSelected ? 'Active' : 'Select'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProjectDetails(project);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 flex items-center gap-1.5 transition-all font-semibold text-xs"
                          title="View Project Details & Security Lifecycle Timeline"
                        >
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Timeline & Details</span>
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(project);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all group flex items-center gap-1"
                        title="Delete Project"
                        aria-label={`Delete project ${project.name}`}
                      >
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeView === 'details' && selectedProjectForDetails && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1322] border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('projects')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1 text-xs font-mono"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Projects</span>
              </button>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold font-mono text-white">
                    {selectedProjectForDetails.name}
                  </h2>
                  <span className="text-[10px] font-mono uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                    {selectedProjectForDetails.targetType.replace('_', ' ')}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold ${
                    selectedProjectForDetails.status === 'ACTIVE'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {selectedProjectForDetails.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-sans line-clamp-1">
                  {selectedProjectForDetails.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  onSelectProject(selectedProjectForDetails);
                  onNavigate('analyzer');
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Open in Code Auditor</span>
              </button>

              <button
                onClick={() => {
                  onSelectProject(selectedProjectForDetails);
                  onNavigate('reports');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reports</span>
              </button>

              <button
                onClick={() => {
                  onSelectProject(selectedProjectForDetails);
                  onNavigate('urlaudit');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>URL Audit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0B101E] border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Security Posture</span>
                <span className={`text-xl font-bold font-mono ${
                  selectedProjectForDetails.securityScore >= 80 ? 'text-emerald-400' :
                  selectedProjectForDetails.securityScore >= 60 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {selectedProjectForDetails.securityScore} / 100
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#0B101E] border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Critical & High Flaws</span>
                <span className="text-xl font-bold font-mono text-red-400">
                  {selectedProjectForDetails.criticalCount + selectedProjectForDetails.highCount} Issues
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertOctagon className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#0B101E] border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Medium / Low Flaws</span>
                <span className="text-xl font-bold font-mono text-amber-300">
                  {selectedProjectForDetails.mediumCount + selectedProjectForDetails.lowCount} Issues
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-[#0B101E] border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Last Security Scan</span>
                <span className="text-xs font-bold font-mono text-slate-200">
                  {new Date(selectedProjectForDetails.lastScanDate || selectedProjectForDetails.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-[#0A0F1D] border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-2xl">
            <ProjectTimeline
              project={selectedProjectForDetails}
              onNavigateTab={onNavigate}
              onOpenInAnalyzer={onOpenInAnalyzer}
            />
          </div>
        </div>
      )}

      {projectToDelete && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => !isDeleting && setProjectToDelete(null)}
        >
          <div 
            className="bg-[#0D1322] border border-red-500/40 w-full max-w-md rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl shadow-red-950/40 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-mono text-white">
                    Delete Security Project?
                  </h3>
                  <span className="text-xs text-red-400/90 font-mono">Irreversible Action</span>
                </div>
              </div>
              <button
                disabled={isDeleting}
                onClick={() => setProjectToDelete(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 uppercase text-[10px]">Project Name:</span>
                <span className="text-cyan-300 font-bold">{projectToDelete.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 uppercase text-[10px]">Target Type:</span>
                <span className="text-slate-300 uppercase">{projectToDelete.targetType.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 uppercase text-[10px]">Stored Issues:</span>
                <span className="text-red-400 font-bold">{projectToDelete.criticalCount + projectToDelete.highCount + projectToDelete.mediumCount} Vulnerabilities</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              This will permanently delete this project and wipe all stored SAST code audits, URL header scans, telemetry history, and generated reports from the database.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting Project...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
