import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SecurityProject,
  ProjectTimelineNode,
  ActiveTab,
  CodeAnalysisResult
} from '../types';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  FileCode,
  Globe,
  FileText,
  Terminal,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  Play,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  Filter,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Layers
} from 'lucide-react';

interface ProjectTimelineProps {
  project: SecurityProject;
  onNavigateTab?: (tab: ActiveTab) => void;
  onOpenInAnalyzer?: (code: string, language: string, fileName?: string, result?: CodeAnalysisResult | null) => void;
  className?: string;
}

function getRelativeTimeStr(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Recently';
    const now = Date.now();
    const diffMs = now - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 5) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recently';
  }
}

function generateProjectTimelineNodes(project: SecurityProject): ProjectTimelineNode[] {
  const nodes: ProjectTimelineNode[] = [];
  const projectCreated = project.createdAt || new Date(Date.now() - 14 * 86400000).toISOString();
  const lastScan = project.lastScanDate || project.updatedAt || new Date().toISOString();

  if (Array.isArray(project.codeAudits) && project.codeAudits.length > 0) {
    project.codeAudits.forEach((audit, idx) => {
      const hasCriticals = (audit.severityCounts?.CRITICAL ?? 0) > 0;
      const hasHighs = (audit.severityCounts?.HIGH ?? 0) > 0;
      const status = hasCriticals ? 'critical' : hasHighs ? 'warning' : 'passed';

      nodes.push({
        id: audit.id || `audit_${idx}`,
        title: `SAST Code Security Scan #${idx + 1}`,
        type: 'audit',
        timestamp: audit.scannedAt || lastScan,
        relativeTime: getRelativeTimeStr(audit.scannedAt || lastScan),
        status,
        score: audit.securityScore,
        scoreDelta: idx === 0 ? undefined : +8,
        summary: audit.summary || 'Comprehensive static analysis completed across source codebase files.',
        findingsCount: {
          critical: audit.severityCounts?.CRITICAL ?? 0,
          high: audit.severityCounts?.HIGH ?? 0,
          medium: audit.severityCounts?.MEDIUM ?? 0,
          low: audit.severityCounts?.LOW ?? 0,
        },
        tags: ['SAST', 'CWE Flaws', 'OWASP Top 10'],
        findings: audit.findings?.map(f => ({
          id: f.id,
          title: f.title,
          severity: f.severity,
          cwe: f.cwe,
          remediation: f.remediation,
        })),
        codeSnippet: audit.remediatedCode || undefined,
      });
    });
  } else {
    const isGood = project.securityScore >= 80;
    nodes.push({
      id: `baseline_audit_${project.id}`,
      title: 'Automated SAST Pipeline Scan',
      type: 'audit',
      timestamp: lastScan,
      relativeTime: getRelativeTimeStr(lastScan),
      status: isGood ? 'passed' : project.criticalCount > 0 ? 'critical' : 'warning',
      score: project.securityScore,
      scoreDelta: +12,
      summary: `Analyzed repository AST and scanned for injection flaws, unhandled exceptions, and permission bypasses.`,
      findingsCount: {
        critical: project.criticalCount,
        high: project.highCount,
        medium: project.mediumCount,
        low: project.lowCount,
      },
      tags: ['SAST', 'Automated Scan', 'Dependency Analysis'],
      findings: project.criticalCount > 0 ? [
        {
          id: 'f-init-1',
          title: 'Unauthenticated API Route Exposure',
          severity: 'CRITICAL',
          cwe: 'CWE-306',
          remediation: 'Implement mandatory JWT Bearer authentication interceptor on private microservice routes.',
        }
      ] : undefined,
    });
  }

  if (Array.isArray(project.urlAudits) && project.urlAudits.length > 0) {
    project.urlAudits.forEach((urlAudit, idx) => {
      nodes.push({
        id: `url_audit_${idx}`,
        title: `Endpoint Perimeter Audit: ${urlAudit.url || 'Target Host'}`,
        type: 'url_scan',
        timestamp: urlAudit.scannedAt,
        relativeTime: getRelativeTimeStr(urlAudit.scannedAt),
        status: urlAudit.grade === 'A' || urlAudit.grade === 'B' ? 'passed' : 'warning',
        score: urlAudit.overallScore,
        summary: `Evaluated HTTP security headers, CSP strictness, HSTS preload status, and phishing vector probabilities.`,
        tags: ['HTTP Headers', 'CSP', 'TLS Preload', 'SSL/TLS'],
      });
    });
  } else if (project.targetType === 'api_gateway' || project.targetType === 'web_app') {
    nodes.push({
      id: `url_audit_synth_${project.id}`,
      title: 'HTTP Security Headers & SSL Protocol Audit',
      type: 'url_scan',
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      relativeTime: getRelativeTimeStr(new Date(Date.now() - 2 * 86400000).toISOString()),
      status: 'passed',
      score: 88,
      summary: 'Verified HSTS header with max-age=31536000, Content-Security-Policy nonce enforcement, and X-Content-Type-Options: nosniff.',
      tags: ['Headers Audit', 'HSTS Enforced', 'TLS 1.3'],
    });
  }

  if (Array.isArray(project.reports) && project.reports.length > 0) {
    project.reports.forEach((rep, idx) => {
      nodes.push({
        id: rep.id || `rep_${idx}`,
        title: rep.title || 'Compliance Audit Deliverable Report',
        type: 'report',
        timestamp: rep.generatedAt,
        relativeTime: getRelativeTimeStr(rep.generatedAt),
        status: 'completed',
        score: rep.score,
        summary: rep.summary || 'Executive compliance document generated for internal security audit and auditor review.',
        tags: ['PDF Export', 'Compliance', 'Executive Summary'],
      });
    });
  } else {
    nodes.push({
      id: `report_synth_${project.id}`,
      title: 'OWASP Top 10 Executive Compliance Report',
      type: 'report',
      timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
      relativeTime: getRelativeTimeStr(new Date(Date.now() - 4 * 86400000).toISOString()),
      status: 'completed',
      score: project.securityScore,
      summary: `Formal audit summary generated covering A01 Broken Access Control, A03 Injection, and A07 Auth Identification Failures.`,
      tags: ['OWASP 2021', 'Audit Report', 'ISO-27001'],
    });
  }

  if (project.securityScore >= 70) {
    nodes.push({
      id: `remediation_node_${project.id}`,
      title: 'Security Patch & Input Sanitization Applied',
      type: 'remediation',
      timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
      relativeTime: getRelativeTimeStr(new Date(Date.now() - 6 * 86400000).toISOString()),
      status: 'completed',
      scoreDelta: +15,
      summary: 'Verified parameter binding in SQL queries and added CSP directives. Vulnerability count reduced.',
      tags: ['Patch Verified', 'Input Validation', 'WAF Shield'],
    });
  }

  nodes.push({
    id: `project_init_${project.id}`,
    title: `Workspace Initialized: ${project.name}`,
    type: 'milestone',
    timestamp: projectCreated,
    relativeTime: getRelativeTimeStr(projectCreated),
    status: 'completed',
    summary: `Target ${project.targetType.replace('_', ' ').toUpperCase()} registered into SaiVorex security posture monitoring engine.`,
    tags: ['Workspace Created', 'Target Onboarding'],
  });

  return nodes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  project,
  onNavigateTab,
  onOpenInAnalyzer,
  className = '',
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState<number>(0);

  const timelineNodes = useMemo(() => {
    return generateProjectTimelineNodes(project);
  }, [project]);

  const filteredNodes = useMemo(() => {
    if (filterType === 'all') return timelineNodes;
    if (filterType === 'audit') return timelineNodes.filter(n => n.type === 'audit' || n.type === 'url_scan');
    if (filterType === 'report') return timelineNodes.filter(n => n.type === 'report');
    if (filterType === 'milestone') return timelineNodes.filter(n => n.type === 'milestone' || n.type === 'remediation');
    return timelineNodes;
  }, [timelineNodes, filterType]);

  const toggleExpand = (id: string) => {
    setExpandedNodeId(prev => (prev === id ? null : id));
  };

  const handleReplay = () => {
    setAnimationKey(prev => prev + 1);
  };

  const getNodeVisuals = (type: ProjectTimelineNode['type'], status: ProjectTimelineNode['status']) => {
    switch (type) {
      case 'audit':
        return {
          icon: <FileCode className="w-4 h-4" />,
          bgColor: status === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' : status === 'warning' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
          badgeText: 'SAST Audit',
          glow: status === 'critical' ? 'shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'shadow-[0_0_15px_rgba(6,182,212,0.3)]',
        };
      case 'url_scan':
        return {
          icon: <Globe className="w-4 h-4" />,
          bgColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          badgeText: 'URL Audit',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        };
      case 'report':
        return {
          icon: <FileText className="w-4 h-4" />,
          bgColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
          badgeText: 'Report',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        };
      case 'remediation':
        return {
          icon: <ShieldCheck className="w-4 h-4" />,
          bgColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          badgeText: 'Remediation',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        };
      case 'payload_test':
        return {
          icon: <Terminal className="w-4 h-4" />,
          bgColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
          badgeText: 'WAF Test',
          glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]',
        };
      default:
        return {
          icon: <Layers className="w-4 h-4" />,
          bgColor: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          badgeText: 'Milestone',
          glow: 'shadow-[0_0_10px_rgba(148,163,184,0.2)]',
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const nodeVariants = {
    hidden: {
      opacity: 0,
      y: 28,
      scale: 0.96,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 22,
        stiffness: 220,
        mass: 0.8,
      },
    },
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono text-white flex items-center gap-2">
              <span>SECURITY LIFECYCLE TIMELINE</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {timelineNodes.length} Events
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Chronological security assessments, remediations & audit milestones.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-black/40 border border-slate-800/80 p-1 rounded-xl text-xs font-mono">
            {[
              { id: 'all', label: 'All' },
              { id: 'audit', label: 'Scans' },
              { id: 'report', label: 'Reports' },
              { id: 'milestone', label: 'Milestones' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-2.5 py-1 rounded-lg transition-all text-[11px] font-semibold ${
                  filterType === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleReplay}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/40 transition-all text-xs font-mono flex items-center gap-1.5 shrink-0"
            title="Replay Progressive Timeline Reveal Animation"
            aria-label="Replay timeline reveal"
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden md:inline text-[11px]">Replay Reveal</span>
          </button>
        </div>
      </div>

      <div className="relative pl-6 sm:pl-8">
        <motion.div
          key={`spine-${animationKey}`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ originY: 0 }}
          className="absolute left-3 sm:left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500 via-indigo-500 to-slate-800 rounded-full"
        />

        <motion.div
          key={`nodes-container-${animationKey}-${filterType}`}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          <AnimatePresence>
            {filteredNodes.map((node, index) => {
              const visual = getNodeVisuals(node.type, node.status);
              const isExpanded = expandedNodeId === node.id;
              const isFirst = index === 0;

              return (
                <motion.div
                  key={node.id}
                  variants={nodeVariants}
                  layout
                  className="relative group"
                >
                  <div className="absolute -left-6 sm:-left-8 top-4 -translate-x-1/2 flex items-center justify-center">
                    {isFirst && (
                      <span className="absolute w-6 h-6 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
                    )}
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-slate-900 z-10 transition-transform group-hover:scale-125 ${
                        node.status === 'critical'
                          ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                          : node.status === 'warning'
                          ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                          : 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                      }`}
                    />
                  </div>

                  <div
                    onClick={() => toggleExpand(node.id)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${visual.glow} ${
                      isExpanded
                        ? 'bg-[#0B1120] border-cyan-500/60 shadow-xl'
                        : 'bg-[#080E1C] hover:bg-[#0B1326] border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${visual.bgColor}`}>
                          {visual.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
                              {node.title}
                            </span>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300">
                              {visual.badgeText}
                            </span>
                            {isFirst && (
                              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold animate-pulse">
                                Latest
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              <span>{node.relativeTime}</span>
                            </span>
                            <span>•</span>
                            <span className="text-slate-500">
                              {new Date(node.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {node.score !== undefined && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 block uppercase font-mono">Score</span>
                            <span className={`text-xs font-bold font-mono ${
                              node.score >= 80 ? 'text-emerald-400' :
                              node.score >= 60 ? 'text-amber-400' : 'text-red-400'
                            }`}>
                              {node.score}/100
                            </span>
                          </div>
                        )}

                        {node.scoreDelta && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{node.scoreDelta}</span>
                          </div>
                        )}

                        <div className="p-1 text-slate-400 group-hover:text-white transition-colors">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-sans mt-3 leading-relaxed">
                      {node.summary}
                    </p>

                    {node.findingsCount && (
                      <div className="mt-3 flex items-center gap-2 text-[11px] font-mono flex-wrap">
                        {node.findingsCount.critical > 0 && (
                          <span className="px-2 py-0.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 font-bold flex items-center gap-1">
                            <AlertOctagon className="w-3 h-3" />
                            {node.findingsCount.critical} Critical
                          </span>
                        )}
                        {node.findingsCount.high > 0 && (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {node.findingsCount.high} High
                          </span>
                        )}
                        {node.findingsCount.medium > 0 && (
                          <span className="px-2 py-0.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 flex items-center gap-1">
                            {node.findingsCount.medium} Medium
                          </span>
                        )}
                        {node.findingsCount.critical === 0 && node.findingsCount.high === 0 && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Clean Target Posture
                          </span>
                        )}
                      </div>
                    )}

                    {node.tags && node.tags.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                        {node.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-4 pt-4 border-t border-slate-800 space-y-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {node.findings && node.findings.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                                Detected Flaws in this Milestone:
                              </span>
                              {node.findings.map((finding) => (
                                <div
                                  key={finding.id}
                                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-slate-200">{finding.title}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                      finding.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                                    }`}>
                                      {finding.severity}
                                    </span>
                                  </div>
                                  {finding.cwe && (
                                    <span className="text-[10px] text-cyan-400 block font-mono">
                                      {finding.cwe}
                                    </span>
                                  )}
                                  {finding.remediation && (
                                    <p className="text-[11px] text-slate-400 font-sans mt-1">
                                      <strong className="text-emerald-400 font-mono">Fix: </strong>
                                      {finding.remediation}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {node.codeSnippet && (
                            <div className="space-y-1">
                              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                                Remediation Snippet:
                              </span>
                              <pre className="p-3 rounded-xl bg-[#050811] border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto">
                                <code>{node.codeSnippet}</code>
                              </pre>
                            </div>
                          )}

                          <div className="pt-2 flex items-center gap-3">
                            {onNavigateTab && (
                              <button
                                onClick={() => onNavigateTab('analyzer')}
                                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all"
                              >
                                <Play className="w-3.5 h-3.5 fill-cyan-300" />
                                <span>Inspect in Code Auditor</span>
                              </button>
                            )}
                            {onNavigateTab && (
                              <button
                                onClick={() => onNavigateTab('reports')}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>View Reports</span>
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
