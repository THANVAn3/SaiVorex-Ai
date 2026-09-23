import React, { useState, useEffect } from 'react';
import { SecurityProject } from '../types';
import { Shield, Plus, FolderKanban, Search, Trash2, Edit3, ArrowRight, ExternalLink, Calendar, AlertOctagon, CheckCircle2, Copy, Clock, X } from 'lucide-react';
import { ProjectTimeline } from './ProjectTimeline';

interface ProjectManagerProps {
  currentProject: SecurityProject | null;
  onSelectProject: (project: SecurityProject) => void;
  onNavigateToTab: (tab: any) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  currentProject,
  onSelectProject,
  onNavigateToTab,
}) => {
  const [projects, setProjects] = useState<SecurityProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectDesc, setNewProjectDesc] = useState<string>('');
  const [newProjectType, setNewProjectType] = useState<SecurityProject['targetType']>('web_app');

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingTimelineProject, setViewingTimelineProject] = useState<SecurityProject | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const savedUser = localStorage.getItem('saivorex_user');
      const token = savedUser ? JSON.parse(savedUser).token : '';
      const response = await fetch('/api/projects', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      if (Array.isArray(data.projects)) {
        setProjects(data.projects);
        if (!currentProject && data.projects.length > 0) {
          onSelectProject(data.projects[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const savedUser = localStorage.getItem('saivorex_user');
      const token = savedUser ? JSON.parse(savedUser).token : '';
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: newProjectName.trim(),
          description: newProjectDesc.trim() || 'Custom Security Audit Target',
          targetType: newProjectType,
        }),
      });

      const data = await response.json();
      if (data.project) {
        setProjects((prev) => [data.project, ...prev]);
        onSelectProject(data.project);
        setShowCreateModal(false);
        setNewProjectName('');
        setNewProjectDesc('');
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const savedUser = localStorage.getItem('saivorex_user');
      const token = savedUser ? JSON.parse(savedUser).token : '';
      await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (currentProject?.id === id) {
        const remaining = projects.filter((p) => p.id !== id);
        if (remaining.length > 0) {
          onSelectProject(remaining[0]);
        }
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'ALL') return matchesSearch;
    return matchesSearch && p.targetType === filterType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-950/60 border border-cyan-800/80 rounded-xl">
            <FolderKanban className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
              Persistent Security Projects Workspace
            </h2>
            <p className="text-xs text-slate-400">
              Manage target applications, stored SAST findings, URL reports & persistent audit histories.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>NEW SECURITY PROJECT</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['ALL', 'web_app', 'source_code', 'api_gateway', 'network'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all uppercase whitespace-nowrap ${
                filterType === type
                  ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs animate-pulse">
          Loading Security Projects Workspace...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-3">
          <Shield className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 font-mono">No security projects matching your filter.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono rounded-xl inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => {
            const isSelected = currentProject?.id === p.id;
            return (
              <div
                key={p.id}
                className={`p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-slate-900/95 border-cyan-500/60 shadow-xl shadow-cyan-950/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[9px] font-bold rounded uppercase">
                      {p.targetType.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => setDeletingId(p.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold font-mono text-white line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-slate-400 font-sans line-clamp-2">{p.description}</p>
                </div>

                <div className="p-3 bg-[#070a12] border border-slate-800/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 text-[10px]">SECURITY HEALTH</span>
                    <span className="font-bold text-cyan-400">{p.securityScore}/100</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="text-red-400 font-bold">{p.criticalCount} Critical</span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">{p.highCount} High</span>
                    <span>•</span>
                    <span className="text-yellow-400 font-bold">{p.mediumCount} Med</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingTimelineProject(p)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 transition-all"
                      title="View Project Details & Security Lifecycle Timeline"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>TIMELINE</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectProject(p);
                        onNavigateToTab('analyzer');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      <span>OPEN</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121F] border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-cyan-400" />
              <span>Create New Security Project</span>
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold block">PROJECT NAME</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. E-Commerce Website Audit"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold block">TARGET AUDIT TYPE</label>
                <select
                  value={newProjectType}
                  onChange={(e) => setNewProjectType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="web_app">Web Application & Endpoint</option>
                  <option value="source_code">Source Code / SAST Repository</option>
                  <option value="api_gateway">REST / GraphQL API Gateway</option>
                  <option value="network">Network Interface & Hotspot</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold block">DESCRIPTION</label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Brief scope description..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 text-slate-950 rounded-xl font-bold hover:bg-cyan-400"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D121F] border border-red-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertOctagon className="w-6 h-6" />
              <h3 className="text-base font-bold font-mono">Delete Security Project?</h3>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              This will permanently delete all stored SAST code audits, URL header scans, reports, and telemetry logs for this project. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-mono rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deletingId)}
                className="px-4 py-2 bg-red-600 text-white text-xs font-mono rounded-xl font-bold hover:bg-red-500"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingTimelineProject && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setViewingTimelineProject(null)}
        >
          <div
            className="bg-[#0A0F1D] border border-cyan-500/40 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl shadow-cyan-950/50 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  <span>{viewingTimelineProject.name} — Security Details & Timeline</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">{viewingTimelineProject.description}</p>
              </div>
              <button
                onClick={() => setViewingTimelineProject(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ProjectTimeline
              project={viewingTimelineProject}
              onNavigateTab={onNavigateToTab}
            />
          </div>
        </div>
      )}
    </div>
  );
};
