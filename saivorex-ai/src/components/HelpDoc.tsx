import React from 'react';
import { HelpCircle, Shield, AlertTriangle, Code, Globe, Terminal, FileText, CheckCircle2, Lock } from 'lucide-react';

export const HelpDoc: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-cyan-400" />
          <span>SaiVorex Documentation & Security Audit Manual</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete operational guidelines for static application security testing (SAST), web header auditing, OWASP Top 10 compliance, and educational exploit testing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
        <div className="bg-[#0D1322] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 font-mono font-bold text-slate-200">
            <Code className="w-4 h-4 text-cyan-400" />
            <span>1. Source Code Auditor (SAST)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Performs static code auditing across multiple languages (Python, JavaScript, TypeScript, Go, Java, PHP, Rust, C++). Evaluates line-by-line vulnerabilities, CWE mappings, exploit scenarios, and generates automated secure refactored code patches.
          </p>
        </div>

        <div className="bg-[#0D1322] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 font-mono font-bold text-slate-200">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>2. URL & Security Header Auditor</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Scans web target domains for standard defensive HTTP headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CORS). Calculates phishing safety score and detects information disclosure vulnerabilities.
          </p>
        </div>

        <div className="bg-[#0D1322] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 font-mono font-bold text-slate-200">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>3. OWASP Top 10 Compliance Matrix</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Interactive breakdown of the OWASP Top 10 (2021) categories (A01 to A10). Demonstrates vulnerable code vs. secure hardened code, remediation strategies, and tracks project compliance status.
          </p>
        </div>

        <div className="bg-[#0D1322] border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 font-mono font-bold text-slate-200">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>4. Payload Laboratory & WAF Sandbox</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Educational sandbox designed to test web application firewall (WAF) regex patterns, input sanitizers, and boolean tautologies in a isolated client-side test engine.
          </p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
          <Lock className="w-5 h-5" />
          <span>Authorized Security Testing Policy</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          SaiVorex is designed exclusively for authorized penetration testing, vulnerability assessment of owned systems, educational defensive security research, and code auditing. Users are strictly required to obtain explicit written authorization prior to auditing any external domain or network infrastructure.
        </p>
      </div>
    </div>
  );
};
