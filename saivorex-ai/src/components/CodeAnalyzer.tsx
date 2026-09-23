import React, { useState, useRef } from 'react';
import { CODE_SAMPLE_PRESETS } from '../data/presets';
import { CodeAnalysisResult, Severity } from '../types';
import { Code, Terminal, Play, ShieldAlert, CheckCircle, Copy, AlertTriangle, Cpu, Sparkles, RefreshCw, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

interface CodeAnalyzerProps {
  onScanStateChange: (scanning: boolean) => void;
  onAnalysisComplete: (result: CodeAnalysisResult) => void;
  initialCode?: string;
  initialLanguage?: string;
  initialFileName?: string;
  initialResult?: CodeAnalysisResult | null;
}

export interface LanguagePlatform {
  id: string;
  name: string;
  category: string;
  badgeColor: string;
  defaultSnippet: string;
}

export const LANGUAGE_PLATFORMS: LanguagePlatform[] = [
  {
    id: 'c',
    name: 'C',
    category: 'Systems / Low-Level',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    defaultSnippet: `#include <stdio.h>\n#include <string.h>\n\nvoid process_data(char *input) {\n    char buf[32];\n    // Unchecked buffer copy\n    strcpy(buf, input);\n}\n\nint main(int argc, char **argv) {\n    if (argc > 1) process_data(argv[1]);\n    return 0;\n}`
  },
  {
    id: 'cpp',
    name: 'C++',
    category: 'Object-Oriented Systems',
    badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
    defaultSnippet: `#include <iostream>\n\nclass DataHandler {\npublic:\n    char* buffer;\n    DataHandler() { buffer = new char[64]; }\n    ~DataHandler() { delete[] buffer; }\n    void print() { std::cout << buffer << std::endl; }\n};\n\nint main() {\n    DataHandler* dh = new DataHandler();\n    delete dh;\n    dh->print(); // Use-after-free\n    return 0;\n}`
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Scripting / Web API',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    defaultSnippet: `from flask import Flask, request\nimport sqlite3\n\napp = Flask(__name__)\n\n@app.route("/user")\ndef get_user():\n    username = request.args.get("name")\n    conn = sqlite3.connect("db.sqlite")\n    # Vulnerable raw query interpolation\n    query = f"SELECT * FROM users WHERE name = '{username}'"\n    return conn.execute(query).fetchall()`
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Browser / Web Front-End',
    badgeColor: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10',
    defaultSnippet: `function renderSearch(query) {\n  // Vulnerable innerHTML assignment causing DOM XSS\n  document.getElementById("results").innerHTML = "<h2>Search: " + query + "</h2>";\n}`
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Server Async Runtime',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    defaultSnippet: `import express from 'express';\nconst app = express();\n\napp.get("/exec", (req, res) => {\n  const cmd = req.query.cmd;\n  // Vulnerable command execution\n  require('child_process').exec("ping " + cmd, (err, stdout) => {\n    res.send(stdout);\n  });\n});`
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Type-Safe Fullstack',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    defaultSnippet: `import jwt from 'jsonwebtoken';\n\nconst JWT_SECRET = "hardcoded_secret_key_12345";\n\nexport function verifyToken(token: string) {\n  return jwt.verify(token, JWT_SECRET, {\n    algorithms: ['HS256', 'none'] as any\n  });\n}`
  },
  {
    id: 'java',
    name: 'Java',
    category: 'Enterprise Backend',
    badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
    defaultSnippet: `import java.io.*;\n\npublic class Serializer {\n    public Object deserialize(byte[] data) throws Exception {\n        ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(data));\n        return ois.readObject(); // Insecure deserialization\n    }\n}`
  },
  {
    id: 'csharp',
    name: 'C#',
    category: 'Enterprise Microsoft .NET',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    defaultSnippet: `using System.Xml;\n\npublic class XmlHandler {\n    public void ReadXml(string xmlPayload) {\n        XmlDocument doc = new XmlDocument();\n        // Insecure DTD Processing\n        XmlReaderSettings settings = new XmlReaderSettings();\n        settings.DtdProcessing = DtdProcessing.Parse;\n        doc.Load(XmlReader.Create(new System.IO.StringReader(xmlPayload), settings));\n    }\n}`
  },
  {
    id: 'go',
    name: 'Go',
    category: 'Concurrent Microservices',
    badgeColor: 'border-teal-500/40 text-teal-400 bg-teal-500/10',
    defaultSnippet: `package main\nimport (\n\t"fmt"\n\t"os/exec"\n)\n\nfunc main() {\n\tuserHost := "127.0.0.1; cat /etc/passwd"\n\tcmd := fmt.Sprintf("ping -c 1 %s", userHost)\n\t_ = exec.Command("sh", "-c", cmd).Run()\n}`
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'Memory-Safe Systems',
    badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    defaultSnippet: `fn main() {\n    let ptr = 0x12345 as *const i32;\n    unsafe {\n        // Unsafe raw pointer dereference\n        let val = *ptr;\n        println!("{}", val);\n    }\n}`
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'Dynamic Web Engine',
    badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    defaultSnippet: `<?php\n$file = $_GET['file'];\n// Path traversal flaw\ninclude("/var/www/templates/" . $file);\n?>`
  },
  {
    id: 'ruby',
    name: 'Ruby',
    category: 'Dynamic Scripting',
    badgeColor: 'border-red-500/40 text-red-400 bg-red-500/10',
    defaultSnippet: `class WebApp\n  def process(input_str)\n    # Dangerous eval\n    eval(input_str)\n  end\nend`
  },
  {
    id: 'sql',
    name: 'SQL',
    category: 'Database Query Engine',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    defaultSnippet: `CREATE PROCEDURE FindUser (@Name NVARCHAR(50))\nAS\nBEGIN\n    DECLARE @sql NVARCHAR(MAX);\n    SET @sql = 'SELECT * FROM Users WHERE Name = ''' + @Name + '''';\n    EXEC (@sql);\nEND`
  }
];

export const CodeAnalyzer: React.FC<CodeAnalyzerProps> = ({
  onScanStateChange,
  onAnalysisComplete,
  initialCode,
  initialLanguage,
  initialFileName,
  initialResult,
}) => {
  const [code, setCode] = useState<string>(initialCode || CODE_SAMPLE_PRESETS[0].code);
  const [language, setLanguage] = useState<string>(initialLanguage || CODE_SAMPLE_PRESETS[0].language);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<CodeAnalysisResult | null>(initialResult || null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'findings' | 'refactored'>('findings');
  
  const [selectedVulnerabilityOption, setSelectedVulnerabilityOption] = useState<string>('ALL');
  
  const platformNavRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (initialCode !== undefined && initialCode !== '') {
      setCode(initialCode);
    }
    if (initialLanguage) {
      setLanguage(initialLanguage);
    }
    if (initialResult !== undefined) {
      setResult(initialResult);
    }
  }, [initialCode, initialLanguage, initialResult]);

  React.useEffect(() => {
    const handleGlobalScan = () => {
      if (!isAnalyzing && code.trim()) {
        handleRunAnalysis();
      }
    };
    window.addEventListener('saivorex:run-scan', handleGlobalScan);
    return () => window.removeEventListener('saivorex:run-scan', handleGlobalScan);
  }, [code, language, isAnalyzing]);

  const handleSelectPlatform = (platId: string) => {
    setLanguage(platId);
    
    const matchedPreset = CODE_SAMPLE_PRESETS.find((p) => p.language.toLowerCase() === platId.toLowerCase());
    if (matchedPreset) {
      setCode(matchedPreset.code);
    } else {
      const plat = LANGUAGE_PLATFORMS.find((p) => p.id === platId);
      if (plat) {
        setCode(plat.defaultSnippet);
      }
    }
    setResult(null);
    setError(null);
    setSelectedVulnerabilityOption('ALL');
  };

  const handleScrollPlatforms = (dir: 'left' | 'right') => {
    if (platformNavRef.current) {
      const scrollAmt = dir === 'left' ? -220 : 220;
      platformNavRef.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  const handleRunAnalysis = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    onScanStateChange(true);
    setError(null);
    setSelectedVulnerabilityOption('ALL');

    try {
      const response = await fetch('/api/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to analyze code snippet.');
      }

      const data: CodeAnalysisResult = await response.json();
      setResult(data);
      onAnalysisComplete(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during security scanning.');
    } finally {
      setIsAnalyzing(false);
      onScanStateChange(false);
    }
  };

  const handleLoadPresetOption = (presetId: string) => {
    const preset = CODE_SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCode(preset.code);
      setLanguage(preset.language);
      setResult(null);
      setError(null);
      setSelectedVulnerabilityOption('ALL');
    }
  };

  const handleCopyRefactoredCode = () => {
    if (result?.remediatedCode) {
      navigator.clipboard.writeText(result.remediatedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40';
    if (score >= 50) return 'text-amber-400 border-amber-500/50 bg-amber-950/40';
    return 'text-red-400 border-red-500/50 bg-red-950/40';
  };

  const currentPlatformInfo = LANGUAGE_PLATFORMS.find(
    (p) => p.id === language.toLowerCase()
  ) || {
    id: language,
    name: language.toUpperCase(),
    category: 'Custom Language Environment',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Code Security Auditor & SAST Suite</h2>
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium">
              Multi-Language SAST
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Run a security scan on your source code. After code execution, discovered vulnerability categories and vulnerability preset choices will be available for deep inspection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
          <label className="text-xs font-mono text-slate-400 shrink-0 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick Sample Code:</span>
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) handleLoadPresetOption(e.target.value);
            }}
            defaultValue=""
            className="w-full sm:w-auto bg-slate-800/90 border border-slate-700 text-xs text-slate-200 px-3.5 py-2 rounded-2xl focus:outline-none focus:border-cyan-500 font-mono shadow-sm"
          >
            <option value="" disabled>-- Select Starter Sample --</option>
            {CODE_SAMPLE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.title} ({preset.language.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-3xl space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
              Supported Languages
            </span>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              (Select Language)
            </span>
          </div>

          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${currentPlatformInfo.badgeColor}`}>
            Active: {currentPlatformInfo.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScrollPlatforms('left')}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all shrink-0 active:scale-95"
            title="Scroll Languages Left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div
            ref={platformNavRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 w-full scroll-smooth"
          >
            {LANGUAGE_PLATFORMS.map((plat) => {
              const isActive = language.toLowerCase() === plat.id;
              return (
                <button
                  key={plat.id}
                  onClick={() => handleSelectPlatform(plat.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap border shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-white border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="font-semibold">{plat.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handleScrollPlatforms('right')}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all shrink-0 active:scale-95"
            title="Scroll Languages Right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="bg-slate-900/90 px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-slate-300 font-medium">Source Editor</span>
                <span className="text-[10px] text-slate-500 font-mono">({currentPlatformInfo.category})</span>
              </div>

              <div className="flex items-center gap-2.5">
                <select
                  value={language}
                  onChange={(e) => handleSelectPlatform(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-[11px] text-cyan-300 px-3 py-1 rounded-xl focus:outline-none focus:border-cyan-500 font-mono shadow-sm"
                >
                  {LANGUAGE_PLATFORMS.map((plat) => (
                    <option key={plat.id} value={plat.id}>
                      {plat.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setCode('')}
                  className="text-[11px] text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 font-mono transition-all"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (!isAnalyzing && code.trim()) {
                      handleRunAnalysis();
                    }
                  }
                }}
                placeholder="Paste source code snippet here to test vulnerabilities... (Press Ctrl + Enter to analyze)"
                rows={16}
                className="w-full bg-[#070a12] p-5 text-xs font-mono text-slate-200 focus:outline-none resize-y leading-relaxed tracking-wide border-0 focus:ring-0 selection:bg-cyan-500/30 selection:text-white"
              />
            </div>

            <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4">
              <span className="text-[11px] text-slate-400 font-mono">
                {code.split('\n').length} lines | {code.length} chars
              </span>

              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || !code.trim()}
                className="flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-950 font-bold px-6 py-2.5 rounded-2xl text-xs transition-all uppercase tracking-tight shadow-md disabled:opacity-50 active:scale-95"
                title="Run Security Scan (Ctrl + Enter)"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Analyzing Vulnerabilities...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Run SaiVorex Scan</span>
                    <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-slate-900/20 text-[10px] font-mono text-slate-800 border border-slate-900/30">
                      Ctrl + ↵
                    </kbd>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-950/80 border border-red-800/80 rounded-2xl text-red-300 text-xs flex items-start gap-3 shadow-lg">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-red-200">Audit Execution Error</span>
                <p className="mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-4">
          {!result && !isAnalyzing && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center space-y-4 flex flex-col items-center justify-center min-h-[420px] shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/50 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shadow-inner">
                <Cpu className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h3 className="text-white font-bold text-base">Scanner Ready</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click <strong className="text-cyan-300">Run SaiVorex Scan</strong> to audit code on the <span className="text-slate-200 font-mono font-semibold">{currentPlatformInfo.name}</span>.
                </p>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[420px] shadow-xl">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-400 animate-spin" />
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold text-base">Auditing Source Code...</h3>
                <p className="text-xs text-slate-400 font-mono">Running SAST evaluation for {currentPlatformInfo.name}</p>
              </div>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="space-y-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        SaiVorex Health Score
                      </span>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-medium">
                        LLM Confidence: {result.llmConfidence || 82}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white font-mono">{result.securityScore}</span>
                      <span className="text-slate-500 text-xs font-mono">/ 100</span>
                    </div>
                  </div>

                  <div className={`px-4 py-2 rounded-2xl border text-center font-mono shrink-0 ${getScoreColor(result.securityScore)}`}>
                    <span className="text-xs font-bold block">
                      {result.securityScore >= 80 ? 'LOW RISK' : result.securityScore >= 50 ? 'MODERATE RISK' : 'CRITICAL RISK'}
                    </span>
                    <span className="text-[10px] opacity-80">{result.totalVulnerabilities} Flaw(s) Found</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/50">
                  {result.summary}
                </p>

                <div className="grid grid-cols-5 gap-1.5 font-mono text-center">
                  <div className="bg-red-950/60 border border-red-900/60 p-2 rounded-xl">
                    <span className="text-[10px] text-red-400 block font-bold">CRIT</span>
                    <span className="text-sm font-black text-white">{result.severityCounts.CRITICAL || 0}</span>
                  </div>
                  <div className="bg-rose-950/60 border border-rose-900/60 p-2 rounded-xl">
                    <span className="text-[10px] text-rose-400 block font-bold">HIGH</span>
                    <span className="text-sm font-black text-white">{result.severityCounts.HIGH || 0}</span>
                  </div>
                  <div className="bg-amber-950/60 border border-amber-900/60 p-2 rounded-xl">
                    <span className="text-[10px] text-amber-400 block font-bold">MED</span>
                    <span className="text-sm font-black text-white">{result.severityCounts.MEDIUM || 0}</span>
                  </div>
                  <div className="bg-blue-950/60 border border-blue-900/60 p-2 rounded-xl">
                    <span className="text-[10px] text-blue-400 block font-bold">LOW</span>
                    <span className="text-sm font-black text-white">{result.severityCounts.LOW || 0}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">INFO</span>
                    <span className="text-sm font-black text-white">{result.severityCounts.INFO || 0}</span>
                  </div>
                </div>

                <div className="flex border-b border-slate-800 pt-2">
                  <button
                    onClick={() => setActiveViewMode('findings')}
                    className={`flex-1 py-2 text-xs font-bold font-mono border-b-2 transition-all ${
                      activeViewMode === 'findings'
                        ? 'border-cyan-400 text-cyan-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Vulnerability Findings ({result.findings.length})
                  </button>
                  <button
                    onClick={() => setActiveViewMode('refactored')}
                    className={`flex-1 py-2 text-xs font-bold font-mono border-b-2 transition-all ${
                      activeViewMode === 'refactored'
                        ? 'border-cyan-400 text-cyan-300'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Refactored Code
                  </button>
                </div>
              </div>

              {activeViewMode === 'findings' && (
                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Select Vulnerability Option / Preset
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      Discovered After Execution
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Choose from the detected vulnerabilities or select a preset option to highlight findings or test specific flaw patterns:
                  </p>

                  <div className="space-y-2">
                    <select
                      value={selectedVulnerabilityOption}
                      onChange={(e) => setSelectedVulnerabilityOption(e.target.value)}
                      className="w-full bg-[#070a12] border border-cyan-500/40 text-xs text-cyan-300 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
                    >
                      <option value="ALL">-- ALL DISCOVERED FINDINGS ({result.findings.length}) --</option>
                      <optgroup label="Detected Flaws From Code Execution">
                        {result.findings.map((f, idx) => (
                          <option key={f.id || idx} value={f.title}>
                            {f.severity} | {f.title} ({f.cwe})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Standard Vulnerability Categories">
                        <option value="SQL Injection">SQL Injection (SQLi)</option>
                        <option value="Cross-Site Scripting">Cross-Site Scripting (XSS / DOM)</option>
                        <option value="Command Execution">Command Injection / RCE</option>
                        <option value="Buffer Overflow">Buffer Overflow & Memory Corruption</option>
                        <option value="Hardcoded">Hardcoded Secrets & Token Flaws</option>
                        <option value="SSRF">Server-Side Request Forgery (SSRF)</option>
                        <option value="Deserialization">Insecure Deserialization</option>
                        <option value="Path Traversal">Path / File Traversal</option>
                      </optgroup>
                      <optgroup label="Vulnerability Test Presets (Load New Code)">
                        {CODE_SAMPLE_PRESETS.map((p) => (
                          <option key={p.id} value={`PRESET:${p.id}`}>
                            [PRESET] {p.title} ({p.language.toUpperCase()})
                          </option>
                        ))}
                      </optgroup>
                    </select>

                    {selectedVulnerabilityOption.startsWith('PRESET:') && (
                      <div className="p-3 bg-cyan-950/40 border border-cyan-800/80 rounded-xl flex items-center justify-between gap-3">
                        <span className="text-xs text-cyan-200 font-mono">
                          Selected Preset: <strong>{CODE_SAMPLE_PRESETS.find(p => `PRESET:${p.id}` === selectedVulnerabilityOption)?.title}</strong>
                        </span>
                        <button
                          onClick={() => {
                            const presetId = selectedVulnerabilityOption.replace('PRESET:', '');
                            handleLoadPresetOption(presetId);
                          }}
                          className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg font-mono transition-all shrink-0 shadow-md"
                        >
                          Load & Execute Preset
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeViewMode === 'findings' && (
                <div className="space-y-3">
                  {result.findings.length === 0 ? (
                    <div className="p-6 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl text-center space-y-2">
                      <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                      <h4 className="text-white font-bold text-sm">No Security Vulnerabilities Detected</h4>
                      <p className="text-xs text-slate-400">The provided code snippet passed automated static analysis tests.</p>
                    </div>
                  ) : (
                    result.findings
                      .filter((finding) => {
                        if (selectedVulnerabilityOption === 'ALL') return true;
                        if (selectedVulnerabilityOption.startsWith('PRESET:')) return true;
                        const optionVal = selectedVulnerabilityOption.toLowerCase();
                        return (
                          finding.title.toLowerCase().includes(optionVal) ||
                          finding.cwe.toLowerCase().includes(optionVal) ||
                          finding.owaspCategory.toLowerCase().includes(optionVal) ||
                          finding.description.toLowerCase().includes(optionVal)
                        );
                      })
                      .map((finding) => (
                        <div
                          key={finding.id}
                          className="bg-[#090d18] border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-4 space-y-3 text-xs shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getSeverityBadge(finding.severity)}`}>
                                  {finding.severity}
                                </span>
                                <span className="bg-slate-900 text-cyan-300 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono">
                                  {finding.cwe}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  Lines {finding.lineRange[0]}-{finding.lineRange[1]}
                                </span>
                              </div>
                              <h4 className="font-bold text-white text-sm">{finding.title}</h4>
                            </div>
                          </div>

                          <div className="space-y-2 text-slate-300">
                            <p className="leading-relaxed">{finding.description}</p>

                            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                              <span className="text-[10px] font-mono text-purple-400 font-bold block uppercase">
                                Exploit Proof of Concept:
                              </span>
                              <p className="text-slate-300 leading-relaxed font-mono text-[11px]">{finding.exploitScenario}</p>
                            </div>

                            <div className="bg-cyan-950/30 p-3 rounded-xl border border-cyan-900/40 space-y-1">
                              <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">
                                Remediation Steps:
                              </span>
                              <p className="text-cyan-200 leading-relaxed text-[11px]">{finding.remediation}</p>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}

              {activeViewMode === 'refactored' && (
                <div className="bg-[#090d18] border border-slate-800 rounded-2xl overflow-hidden space-y-0 shadow-lg">
                  <div className="bg-[#0f1526] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Refactored Production Patch (Defensive Review)
                    </span>

                    <button
                      onClick={handleCopyRefactoredCode}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-all active:scale-95"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-[#070a12] text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[500px]">
                    <code>{result.remediatedCode}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

