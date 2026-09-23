import React, { useState } from 'react';
import {
  Bot,
  Play,
  Pause,
  RotateCcw,
  Terminal,
  ShieldAlert,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Cpu
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  codename: string;
  role: string;
  description: string;
  status: 'active' | 'idle' | 'running';
  model: string;
  tasksCompleted: number;
  accuracy: string;
  lastAction: string;
  badgeColor: string;
}

export const AiAgentsView: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent-1',
      name: 'Sentinel Auto-Patch',
      codename: 'AEGIS-7',
      role: 'Vulnerability Remediation',
      description: 'Automatically patches detected OWASP flaws, sanitizes inputs, and generates secure Pull Requests.',
      status: 'active',
      model: 'SaiVorex Core v3.6',
      tasksCompleted: 412,
      accuracy: '99.4%',
      lastAction: 'Applied parameterized query patch to /api/auth/login.ts',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'agent-2',
      name: 'Vortex Red-Team Fuzzer',
      codename: 'FUZZ-X',
      role: 'Automated Penetration Testing',
      description: 'Simulates black-box and gray-box adversary vectors against test endpoints to discover 0-day flaws.',
      status: 'running',
      model: 'SaiVorex Deep AST v3.6',
      tasksCompleted: 189,
      accuracy: '98.1%',
      lastAction: 'Fuzzing GraphQL mutations with boundary overflow payloads',
      badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
    },
    {
      id: 'agent-3',
      name: 'PhishHunter Domain Intel',
      codename: 'SPECTER-9',
      role: 'Brand & Typosquatting Defense',
      description: 'Monitors newly registered domain registries, SSL cert transparency logs, and lookalike domains.',
      status: 'active',
      model: 'SaiVorex Core v3.6',
      tasksCompleted: 873,
      accuracy: '99.8%',
      lastAction: 'Takedown notice drafted for saiv0rex-login.com (phishing risk: 94%)',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'agent-4',
      name: 'Threat Hunter Sentinel',
      codename: 'CHRONOS-1',
      role: 'SIEM & PC Telemetry Forensics',
      description: 'Correlates raw PC packet streams, socket dumps, and failed SSH handshakes to detect APTs.',
      status: 'idle',
      model: 'SaiVorex Core v3.6',
      tasksCompleted: 620,
      accuracy: '99.1%',
      lastAction: 'Analyzing anomalous outbound socket on port 4444 (Reverse Shell probe)',
      badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
    }
  ]);

  const [activeLogAgent, setActiveLogAgent] = useState<string>('agent-2');
  const [logs, setLogs] = useState<string[]>([
    '[09:41:02] [FUZZ-X] Initialized target sandbox at https://staging.saivorex.io',
    '[09:41:08] [FUZZ-X] Discovered 14 REST endpoints via OpenAPI schema introspection',
    '[09:41:15] [FUZZ-X] Injecting boundary test payloads: SQLi Union Select on /items?cat=',
    '[09:41:22] [FUZZ-X] Response code 200 with zero error leakage. Moving to polyglot XSS',
    '[09:41:35] [FUZZ-X] Testing prototype pollution payload on JSON payload { "__proto__": ... }',
    '[09:41:49] [FUZZ-X] Sanitization filter verified active. Zero execution triggered.',
    '[09:42:01] [FUZZ-X] Probing rate-limiting threshold: 120 reqs/sec -> HTTP 429 Too Many Requests received.'
  ]);

  const toggleAgent = (id: string) => {
    setAgents(prev =>
      prev.map(a => {
        if (a.id === id) {
          const nextStatus = a.status === 'running' ? 'idle' : 'running';
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Autonomous Operations
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              4 Agents Ready
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight mt-1 flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-indigo-400" />
            <span>Autonomous Security Agents</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Deploy self-orchestrating security agents for autonomous remediation, adversarial fuzzing, and continuous telemetry monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [ORCHESTRATOR] Polling all active nodes...`]);
            }}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/10 hover:border-cyan-400/40 text-xs font-mono font-bold flex items-center gap-2 transition-all backdrop-blur-md"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sync Fleet</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => setActiveLogAgent(agent.id)}
            className={`p-5 rounded-2xl bg-[#060e22]/45 backdrop-blur-2xl border transition-all cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.37)] ${
              activeLogAgent === agent.id
                ? 'border-indigo-400/60 ring-1 ring-indigo-400/30 shadow-[0_0_25px_rgba(99,102,241,0.2)]'
                : 'border-white/10 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-slate-300">
                      {agent.codename}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 font-medium">
                    {agent.role}
                  </div>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border uppercase flex items-center gap-1 backdrop-blur-md ${agent.badgeColor}`}>
                {agent.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />}
                {agent.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                {agent.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {agent.description}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs font-mono">
              <div>
                <div className="text-[10px] text-slate-400">TASKS</div>
                <div className="text-white font-bold">{agent.tasksCompleted}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">ACCURACY</div>
                <div className="text-emerald-400 font-bold">{agent.accuracy}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">BASE MODEL</div>
                <div className="text-cyan-300 font-bold truncate">{agent.model}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="text-[11px] font-mono text-slate-300 truncate max-w-[240px]">
                <span className="text-slate-500">Latest: </span>
                {agent.lastAction}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAgent(agent.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all backdrop-blur-md ${
                  agent.status === 'running'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                    : 'bg-indigo-600/30 text-indigo-300 border border-indigo-400/40 hover:bg-indigo-600/50 hover:text-white'
                }`}
              >
                {agent.status === 'running' ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Launch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white font-mono">
              Live Agent Execution Stream
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-300">
            Selected: <span className="text-indigo-400 font-bold">FUZZ-X (Red-Team Fuzzer)</span>
          </span>
        </div>

        <div className="bg-slate-950/70 backdrop-blur-md rounded-xl p-3 font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto border border-white/10">
          {logs.map((log, i) => (
            <div key={i} className="leading-relaxed">
              <span className="text-cyan-400">{log.slice(0, 10)}</span>
              <span className="text-indigo-300 font-bold">{log.slice(10, 20)}</span>
              <span className="text-slate-300">{log.slice(20)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
