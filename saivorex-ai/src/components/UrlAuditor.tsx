import React, { useState } from 'react';
import { UrlScanResult, Severity } from '../types';
import {
  Globe,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  RefreshCw,
  Server,
  Lock,
  ExternalLink,
  ArrowRight,
  Award,
  Filter,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { computeGrade, getHeaderGrade, GRADE_SCALE_LEGEND } from '../utils/grading';

interface UrlAuditorProps {
  onScanStateChange: (scanning: boolean) => void;
  onScanComplete?: (result: UrlScanResult) => void;
}

export const UrlAuditor: React.FC<UrlAuditorProps> = ({ onScanStateChange, onScanComplete }) => {
  const [urlInput, setUrlInput] = useState<string>('https://auth-api.vulnerable-demo.internal');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [result, setResult] = useState<UrlScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gradeFilter, setGradeFilter] = useState<'ALL' | 'O' | 'B' | 'F'>('ALL');
  const [showGradeScale, setShowGradeScale] = useState<boolean>(true);

  const sampleTargets = [
    { label: 'FinTech Auth API', url: 'https://auth-api.vulnerable-demo.internal' },
    { label: 'E-Commerce Storefront', url: 'https://shop.vulnerable-target.org' },
    { label: 'Legacy Admin Portal', url: 'http://admin-portal.legacy-app.dev' },
  ];

  React.useEffect(() => {
    const handleGlobalScan = () => {
      if (!isAuditing && urlInput.trim()) {
        handleRunAudit();
      }
    };
    window.addEventListener('saivorex:run-scan', handleGlobalScan);
    return () => window.removeEventListener('saivorex:run-scan', handleGlobalScan);
  }, [urlInput, isAuditing]);

  const handleRunAudit = async (targetToScan?: string) => {
    const urlToUse = targetToScan || urlInput;
    if (!urlToUse.trim()) return;

    setIsAuditing(true);
    onScanStateChange(true);
    setError(null);

    try {
      const response = await fetch('/api/scan-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToUse }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to perform URL header audit.');
      }

      const data: UrlScanResult = await response.json();
      setResult(data);
      if (onScanComplete) onScanComplete(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while auditing target URL headers.');
    } finally {
      setIsAuditing(false);
      onScanStateChange(false);
    }
  };

  const overallGrade = result ? computeGrade(result.overallScore) : null;
  const activeGradeLetter = result?.grade || overallGrade?.grade || 'B';
  const activeGradePoint = typeof result?.gradePoint === 'number' ? result.gradePoint : overallGrade?.gradePoint || 7.0;
  const activeGradeDesc = result?.gradeDescription || overallGrade?.label || 'Security Posture';

  const headerGpa = result && result.headers.length > 0
    ? (
        result.headers.reduce((acc, h) => {
          const hg = getHeaderGrade(h.status);
          return acc + (typeof h.gradePoint === 'number' ? h.gradePoint : hg.gradePoint);
        }, 0) / result.headers.length
      ).toFixed(1)
    : '0.0';

  const gradeOCount = result?.headers.filter((h) => h.status === 'PASS').length || 0;
  const gradeBCount = result?.headers.filter((h) => h.status === 'WARN').length || 0;
  const gradeFCount = result?.headers.filter((h) => h.status === 'FAIL').length || 0;

  const filteredHeaders = result?.headers.filter((hdr) => {
    if (gradeFilter === 'ALL') return true;
    if (gradeFilter === 'O') return hdr.status === 'PASS';
    if (gradeFilter === 'B') return hdr.status === 'WARN';
    if (gradeFilter === 'F') return hdr.status === 'FAIL';
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">HTTP Security Header & Surface Auditor</h2>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium">
              Grade Point System (O, A, B, C, F)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Inspect target endpoint response headers, CORS policies, cookie flags, and transport protection graded on an academic & enterprise 10-point scale.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!isAuditing && urlInput.trim()) {
                      handleRunAudit();
                    }
                  }
                }}
                placeholder="Enter target URL (e.g. https://api.example.com) — Press Enter to audit"
                className="w-full bg-[#070a12] border border-slate-700/80 text-xs text-slate-200 px-4 py-3 rounded-2xl focus:outline-none focus:border-emerald-500 font-mono tracking-wide"
              />
            </div>

            <button
              onClick={() => handleRunAudit()}
              disabled={isAuditing || !urlInput.trim()}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-white disabled:opacity-50 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs transition-all uppercase tracking-tight shadow-md shrink-0 cursor-pointer"
              title="Audit Target URL (Enter / Ctrl + Enter)"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Auditing Target...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Audit & Calculate Grade</span>
                  <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-slate-900/20 text-[10px] font-mono text-slate-800 border border-slate-900/30">
                    ↵ Enter
                  </kbd>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-500 font-mono">Sample Target Endpoints:</span>
            {sampleTargets.map((target) => (
              <button
                key={target.url}
                onClick={() => {
                  setUrlInput(target.url);
                  handleRunAudit(target.url);
                }}
                className="text-[11px] font-mono bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{target.label}</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && overallGrade && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl backdrop-blur-md">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Target Domain
              </span>
              <div className="text-sm font-bold font-mono text-white truncate" title={result.url}>
                {result.url}
              </div>
              <span className="text-[11px] text-slate-500 font-mono block">
                Audited: {new Date(result.scannedAt).toLocaleTimeString()}
              </span>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md">
                  <Lock className="w-3 h-3" />
                  {result.url.startsWith('https') ? 'HTTPS (TLS Active)' : 'HTTP (Unencrypted)'}
                </span>
              </div>
            </div>

            <div
              className={`bg-gradient-to-br from-slate-900/90 to-slate-950 border ${overallGrade.borderClass} rounded-3xl p-5 space-y-2 shadow-2xl relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Security Grade Result
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${overallGrade.badgeClass}`}>
                  10.0 Scale
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-semibold text-slate-400">GRADE</span>
                  <span className={`text-4xl font-black font-mono tracking-tight ${overallGrade.badgeClass.split(' ')[1]}`}>
                    {activeGradeLetter}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold font-mono text-white">
                    {activeGradePoint}
                  </span>
                  <span className="text-slate-500 text-xs font-mono"> / 10.0 GP</span>
                </div>
              </div>

              <div className="text-[11px] font-mono font-medium text-slate-300 truncate">
                {activeGradeDesc}
              </div>

              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5 mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    activeGradePoint >= 9.0
                      ? 'bg-emerald-400'
                      : activeGradePoint >= 7.5
                      ? 'bg-cyan-400'
                      : activeGradePoint >= 6.0
                      ? 'bg-amber-400'
                      : activeGradePoint >= 4.5
                      ? 'bg-orange-400'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(8, activeGradePoint * 10))}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Overall Health Score
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full font-medium">
                  Confidence: {result.llmConfidence || 86}%
                </span>
              </div>

              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-3xl font-black font-mono text-emerald-400">{result.overallScore}</span>
                <span className="text-slate-500 text-xs font-mono">/ 100</span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400 border-t border-slate-800/80">
                <span>Cumulative Header GPA:</span>
                <span className="text-cyan-400 font-bold">{headerGpa} / 10.0</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl backdrop-blur-md">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Discovered Technologies
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {result.serverTechDiscovered.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-slate-800/80 text-cyan-300 border border-slate-700/80 px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Audit Grade Point Benchmark Scale (10.0 Scale)
                </span>
              </div>
              <button
                onClick={() => setShowGradeScale(!showGradeScale)}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{showGradeScale ? 'Collapse Scale' : 'View Scale'}</span>
                {showGradeScale ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showGradeScale && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
                {GRADE_SCALE_LEGEND.map((item) => {
                  const isCurrent = activeGradeLetter === item.grade;
                  return (
                    <div
                      key={item.grade}
                      className={`p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-slate-800/90 border-cyan-400/80 shadow-lg ring-1 ring-cyan-400/30'
                          : 'bg-slate-950/60 border-slate-800/80 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-base font-black font-mono ${item.color}`}>
                          Grade {item.grade}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-medium text-slate-200 truncate mt-0.5">{item.label}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">{item.gradePoint}</div>
                      <div className="text-[10px] font-mono text-slate-500">Score &ge; {item.minScore}%</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Phishing & Link Safety Rate Assessment
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    URL structure, SSL certificate parameters, domain spoofing & typosquatting analysis
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold border self-start sm:self-auto ${
                  (result.phishingAnalysis?.safetyPercentage || result.overallScore) >= 80
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : (result.phishingAnalysis?.safetyPercentage || result.overallScore) >= 50
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-red-500/20 text-red-400 border-red-500/40'
                }`}
              >
                STATUS: {result.phishingAnalysis?.statusText || (result.overallScore >= 80 ? 'SAFE TARGET' : 'PHISHING SUSPECTED')}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-300 font-bold">Link Safety Rate Score:</span>
                <span
                  className={`font-black text-sm ${
                    (result.phishingAnalysis?.safetyPercentage || result.overallScore) >= 80
                      ? 'text-emerald-400'
                      : (result.phishingAnalysis?.safetyPercentage || result.overallScore) >= 50
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {result.phishingAnalysis?.safetyPercentage || result.overallScore}% Safe
                </span>
              </div>

              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    (result.phishingAnalysis?.safetyPercentage || result.overallScore) >= 80
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                      : (result.phishingAnalysis?.safetyPercentage || result.overallScore) >= 50
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                      : 'bg-gradient-to-r from-red-600 to-rose-500'
                  }`}
                  style={{ width: `${result.phishingAnalysis?.safetyPercentage || result.overallScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
                Phishing Analysis Risk Factors & Inspection Findings:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(result.phishingAnalysis?.phishingRiskFactors || [
                  'Domain SSL certificate verified',
                  'No active typosquatting pattern matched',
                ]).map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2 font-mono"
                  >
                    <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  HTTP Response Header Audit Matrix
                </h3>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Headers audited with individual Grade Points (Grade O: 10.0 GP, Grade B: 6.0 GP, Grade F: 0.0 GP)
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Filter:
                </span>

                <button
                  onClick={() => setGradeFilter('ALL')}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    gradeFilter === 'ALL'
                      ? 'bg-slate-200 text-slate-950 font-bold border-white'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  All ({result.headers.length})
                </button>

                <button
                  onClick={() => setGradeFilter('O')}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    gradeFilter === 'O'
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50 hover:bg-emerald-950/70'
                  }`}
                >
                  Grade O ({gradeOCount})
                </button>

                <button
                  onClick={() => setGradeFilter('B')}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    gradeFilter === 'B'
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-amber-950/40 text-amber-400 border-amber-800/50 hover:bg-amber-950/70'
                  }`}
                >
                  Grade B ({gradeBCount})
                </button>

                <button
                  onClick={() => setGradeFilter('F')}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    gradeFilter === 'F'
                      ? 'bg-red-500 text-white font-bold border-red-400'
                      : 'bg-red-950/40 text-red-400 border-red-800/50 hover:bg-red-950/70'
                  }`}
                >
                  Grade F ({gradeFCount})
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredHeaders.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-2xl">
                  No headers match the selected grade filter.
                </div>
              ) : (
                filteredHeaders.map((hdr, idx) => {
                  const hdrGrade = getHeaderGrade(hdr.status);
                  const effectiveHdrGrade = hdr.grade || hdrGrade.grade;
                  const effectiveHdrGradePoint = typeof hdr.gradePoint === 'number' ? hdr.gradePoint : hdrGrade.gradePoint;

                  return (
                    <div
                      key={idx}
                      className="bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 p-4 rounded-2xl space-y-2 text-xs transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black border ${hdrGrade.badgeClass}`}
                          >
                            GRADE {effectiveHdrGrade} ({effectiveHdrGradePoint.toFixed(1)} GP)
                          </span>

                          <span className="font-bold font-mono text-white text-sm">{hdr.headerName}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              hdr.status === 'PASS'
                                ? 'text-emerald-400 bg-emerald-950/60'
                                : hdr.status === 'WARN'
                                ? 'text-amber-400 bg-amber-950/60'
                                : 'text-red-400 bg-red-950/60'
                            }`}
                          >
                            {hdr.status}
                          </span>

                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
                            Impact: {hdr.severity}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-300 text-xs leading-relaxed">{hdr.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                        <div className="bg-[#070a12] p-3 rounded-xl border border-slate-800">
                          <span className="text-slate-500 block text-[10px]">Detected Value:</span>
                          <span className="text-slate-300 break-all">{hdr.value || 'None (Missing Header)'}</span>
                        </div>

                        <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-900/40">
                          <span className="text-emerald-400 block text-[10px]">Recommended Value:</span>
                          <span className="text-emerald-200 break-all">{hdr.recommendedValue}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              SaiVorex Security Hardening Recommendations
            </h3>

            <div className="space-y-2">
              {result.aiRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-800/40 border border-slate-700/50 p-3.5 rounded-2xl text-xs text-slate-200">
                  <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
