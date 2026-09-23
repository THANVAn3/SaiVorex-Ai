import React from 'react';
import { HelpCircle, Code, Globe, AlertTriangle, Terminal, FileText, Activity, ShieldCheck, AlertOctagon } from 'lucide-react';

export const HelpDocPanel: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono text-xs">
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center gap-3">
        <div className="p-3 bg-cyan-950/60 border border-cyan-800/80 rounded-xl">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Documentation & User Guide</h2>
          <p className="text-slate-400 text-[11px]">
            Comprehensive guide to SaiVorex auditing modules, scoring models, and legal compliance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Code className="w-4 h-4" />
            <span>1. Source Code SAST Auditor</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Paste code snippets or select vulnerability presets. The security engine parses abstract syntax trees to identify OWASP Top 10 flaws, CWE mappings, line ranges, and refactored secure code patches.
          </p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Globe className="w-4 h-4" />
            <span>2. HTTP Security Header Auditor</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Evaluates HTTP response headers (CSP, HSTS, X-Frame-Options, CORS) and performs domain risk analysis for phishing and typosquatting indicators.
          </p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>3. OWASP Top 10 Compliance Matrix</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Tracks organizational security coverage across all 10 OWASP 2021 categories (A01 Broken Access Control through A10 SSRF) with preventive code examples.
          </p>
        </div>

        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <Terminal className="w-4 h-4" />
            <span>4. Payload Laboratory & WAF Sandbox</span>
          </div>
          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            Simulates WAF regex detection rules for SQLi, XSS, Path Traversal, and SSRF. Designed for defensive testing and rule verification.
          </p>
        </div>
      </div>

      <div className="p-5 bg-amber-950/20 border border-amber-500/40 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertOctagon className="w-5 h-5" />
          <span>AUTHORIZED SECURITY TESTING & LEGAL COMPLIANCE POLICY</span>
        </div>
        <p className="text-slate-300 font-sans text-xs leading-relaxed">
          SaiVorex is designed strictly for authorized vulnerability assessment, defensive code auditing, educational security research, and compliance verification. Testing third-party systems without prior explicit written authorization is illegal. Always conduct security assessments against systems you own or have explicit permission to audit.
        </p>
      </div>
    </div>
  );
};
