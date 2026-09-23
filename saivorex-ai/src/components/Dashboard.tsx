import React, { useState, useEffect } from 'react';
import { ActiveTab, SecurityProject, UserProfile } from '../types';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  Radio,
  Wifi,
  Bot,
  Code,
  Globe,
  Zap,
  ArrowRight,
  TrendingUp,
  MapPin,
  Lock,
  Pause,
  Play,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Activity,
  Layers,
  Sparkles,
  Gauge,
  RadioTower,
  Smartphone,
  Cpu
} from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface DashboardProps {
  currentUser?: UserProfile | null;
  projects: SecurityProject[];
  activeProject: SecurityProject | null;
  onSelectProject: (project: SecurityProject) => void;
  onNavigate: (tab: ActiveTab) => void;
  onCreateProjectClick: () => void;
  onDeleteProject?: (id: string) => Promise<boolean | void>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  projects,
  onNavigate,
}) => {
  const displayName = currentUser?.name?.trim() || 'Commander';
  const network = useNetworkStatus();

  const [currentTime, setCurrentTime] = useState<string>('09:42 AM');
  const [currentDate, setCurrentDate] = useState<string>('Mon, 21 Sep 2026');
  const [greeting, setGreeting] = useState<string>('Good morning');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 12) setGreeting('Good morning');
      else if (hours < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');

      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      setCurrentTime(timeStr);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setCurrentDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const [isFeedPaused, setIsFeedPaused] = useState(false);
  const [threatEvents, setThreatEvents] = useState([
    { id: 1, title: 'DDoS Attack Detected', target: '183.12.45.22', time: '2m ago', color: 'rose' },
    { id: 2, title: 'Multiple Failed Logins', target: 'admin', time: '4m ago', color: 'amber' },
    { id: 3, title: 'SQL Injection Attempt', target: "/login.php?id=1' --", time: '6m ago', color: 'rose' },
    { id: 4, title: 'Port Scan', target: 'nmap 172.20.10.0/24', time: '9m ago', color: 'cyan' },
    { id: 5, title: 'Malicious JWT Attempt', target: 'alg: none', time: '12m ago', color: 'rose' },
    { id: 6, title: 'Path Traversal', target: '../../etc/passwd', time: '15m ago', color: 'amber' },
    { id: 7, title: 'Suspicious API Request', target: '/api/v1/users', time: '17m ago', color: 'cyan' },
    { id: 8, title: 'Brute Force Login', target: '192.168.43.21', time: '21m ago', color: 'rose' },
  ]);

  const owaspItems = [
    { code: 'A01', status: 'Fail', state: 'fail' },
    { code: 'A02', status: 'Pass', state: 'pass' },
    { code: 'A03', status: 'Warn', state: 'warn' },
    { code: 'A04', status: 'Pass', state: 'pass' },
    { code: 'A05', status: 'Fail', state: 'fail' },
    { code: 'A06', status: 'Pass', state: 'pass' },
    { code: 'A07', status: 'Warn', state: 'warn' },
    { code: 'A08', status: 'N/E', state: 'info' },
    { code: 'A09', status: 'Pass', state: 'pass' },
    { code: 'A10', status: 'Warn', state: 'warn' },
  ];

  const defaultProjects = [
    { name: 'E-commerce Platform', type: 'Web Application', score: 78, color: 'text-cyan-400', stroke: '#22d3ee' },
    { name: 'Mobile Banking API', type: 'API Gateway', score: 62, color: 'text-indigo-400', stroke: '#818cf8' },
    { name: 'Internal Tools', type: 'Source Code Repo', score: 91, color: 'text-emerald-400', stroke: '#34d399' },
    { name: 'Company Website', type: 'Full Suite', score: 55, color: 'text-amber-400', stroke: '#fbbf24' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-2 pb-1">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{greeting}, {displayName}</span>
            <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitor. Analyze. Defend. &mdash; All from one command center.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-stretch lg:self-auto justify-between lg:justify-end">
          <div className="text-left sm:text-right">
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 sm:justify-end">
              <span className="text-cyan-400">[</span>
              <span>{currentDate}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              {currentTime}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 sm:justify-end pt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>All Systems Operational</span>
            </div>
          </div>

          <div className="bg-[#060e22]/50 border border-white/15 rounded-2xl p-3 px-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center gap-4 backdrop-blur-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">Security Engine</span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                  Active
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>SaiVorex Core v3.6</span>
              </div>
            </div>

            <div className="flex items-end gap-1 h-6 pl-2 border-l border-white/10">
              <span className="w-1 bg-cyan-400 rounded-full h-3 animate-pulse shadow-[0_0_6px_#06b6d4]" />
              <span className="w-1 bg-cyan-400 rounded-full h-5 animate-pulse delay-75 shadow-[0_0_6px_#06b6d4]" />
              <span className="w-1 bg-indigo-400 rounded-full h-2 animate-pulse delay-150 shadow-[0_0_6px_#818cf8]" />
              <span className="w-1 bg-cyan-400 rounded-full h-6 animate-pulse delay-100 shadow-[0_0_6px_#06b6d4]" />
              <span className="w-1 bg-indigo-400 rounded-full h-4 animate-pulse delay-200 shadow-[0_0_6px_#818cf8]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-rose-500/[0.08] backdrop-blur-xl border border-rose-500/30 hover:border-rose-400/60 rounded-2xl p-4 flex items-center gap-3.5 transition-all shadow-[0_8px_24px_rgba(244,63,94,0.15)] group">
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(244,63,94,0.3)]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono leading-none">24</div>
            <div className="text-xs font-semibold text-rose-400 mt-1">Critical</div>
          </div>
        </div>

        <div className="bg-orange-500/[0.08] backdrop-blur-xl border border-orange-500/30 hover:border-orange-400/60 rounded-2xl p-4 flex items-center gap-3.5 transition-all shadow-[0_8px_24px_rgba(249,115,22,0.15)] group">
          <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/40 text-orange-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(249,115,22,0.3)]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono leading-none">57</div>
            <div className="text-xs font-semibold text-orange-400 mt-1">High</div>
          </div>
        </div>

        <div className="bg-amber-500/[0.08] backdrop-blur-xl border border-amber-500/30 hover:border-amber-400/60 rounded-2xl p-4 flex items-center gap-3.5 transition-all shadow-[0_8px_24px_rgba(245,158,11,0.15)] group">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono leading-none">112</div>
            <div className="text-xs font-semibold text-amber-400 mt-1">Medium</div>
          </div>
        </div>

        <div className="bg-cyan-500/[0.08] backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-4 flex items-center gap-3.5 transition-all shadow-[0_8px_24px_rgba(6,182,212,0.15)] group">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono leading-none">231</div>
            <div className="text-xs font-semibold text-cyan-400 mt-1">Low</div>
          </div>
        </div>

        <div className="bg-blue-500/[0.08] backdrop-blur-xl border border-blue-500/30 hover:border-blue-400/60 rounded-2xl p-4 flex items-center gap-3.5 transition-all shadow-[0_8px_24px_rgba(59,130,246,0.15)] col-span-2 sm:col-span-1 group">
          <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/40 text-blue-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(59,130,246,0.3)]">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono leading-none">48</div>
            <div className="text-xs font-semibold text-blue-400 mt-1">Informational</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 2xl:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4 bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between hover:border-cyan-500/30 transition-all">
              <div className="text-xs font-bold text-slate-200 font-sans tracking-wide">
                Security Health Score
              </div>

              <div className="flex items-center gap-4 my-3">
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#healthScoreGrad)"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="45"
                      strokeLinecap="round"
                      fill="transparent"
                    />
                    <defs>
                      <linearGradient id="healthScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
                    <span className="text-2xl font-black text-white font-mono drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">82</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="text-xs font-bold text-emerald-400">
                    Great Security Posture!
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Your environment is more secure than <span className="text-cyan-400 font-semibold">78%</span> of similar organizations.
                  </p>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12% vs last week</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 font-sans tracking-wide">
                  OWASP Top 10 (2021) Compliance
                </span>
                <button
                  onClick={() => onNavigate('owasp')}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2 my-2">
                {owaspItems.map((item) => {
                  let badgeBg = 'bg-white/[0.04] border-white/10 text-slate-300';
                  if (item.state === 'fail') badgeBg = 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.15)]';
                  if (item.state === 'pass') badgeBg = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.15)]';
                  if (item.state === 'warn') badgeBg = 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.15)]';
                  if (item.state === 'info') badgeBg = 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.15)]';

                  return (
                    <div
                      key={item.code}
                      onClick={() => onNavigate('owasp')}
                      className={`p-1.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 backdrop-blur-md ${badgeBg}`}
                    >
                      <span className="text-[11px] font-bold font-mono">{item.code}</span>
                      <span className="text-[9px] font-mono mt-0.5">{item.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-3 bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 font-sans tracking-wide">
                  Recent Projects
                </span>
                <button
                  onClick={() => onNavigate('projects')}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors"
                >
                  <span>See All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2 mt-2">
                {defaultProjects.map((p) => (
                  <div
                    key={p.name}
                    onClick={() => onNavigate('projects')}
                    className="p-2 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.06] flex items-center justify-between gap-2 cursor-pointer transition-all"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{p.type}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-cyan-400/30 bg-cyan-950/40 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                      {p.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-7 bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-sans tracking-wide">
                    Global Threat Map
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                    Real-time
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 relative h-48 flex items-center justify-center">
                  <svg className="w-full h-full opacity-70" viewBox="0 0 400 200" fill="none">
                    <path
                      d="M60 40 Q80 20 120 30 Q150 45 130 80 Q100 90 70 80 Z"
                      fill="#1e293b"
                    />
                    <path
                      d="M90 110 Q120 100 130 140 Q110 180 80 150 Z"
                      fill="#1e293b"
                    />
                    <path
                      d="M180 35 Q220 25 240 50 Q230 85 190 70 Z"
                      fill="#1e293b"
                    />
                    <path
                      d="M190 90 Q220 85 240 120 Q220 160 190 140 Z"
                      fill="#1e293b"
                    />
                    <path
                      d="M260 30 Q340 20 370 70 Q320 110 270 90 Z"
                      fill="#1e293b"
                    />
                    <path
                      d="M300 120 Q350 110 360 150 Q320 170 290 140 Z"
                      fill="#1e293b"
                    />

                    <path
                      d="M100 60 Q200 10 310 65"
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      className="animate-pulse"
                    />
                    <path
                      d="M210 60 Q250 30 330 130"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      className="animate-pulse"
                    />
                    <path
                      d="M340 70 Q250 120 110 130"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />

                    <circle cx="100" cy="60" r="5" fill="#f43f5e" className="animate-ping" />
                    <circle cx="100" cy="60" r="3" fill="#f43f5e" />

                    <circle cx="310" cy="65" r="5" fill="#06b6d4" className="animate-ping" />
                    <circle cx="310" cy="65" r="3" fill="#06b6d4" />

                    <circle cx="210" cy="60" r="3" fill="#f59e0b" />
                    <circle cx="110" cy="130" r="3" fill="#10b981" />
                    <circle cx="330" cy="130" r="3" fill="#818cf8" />
                  </svg>
                </div>

                <div className="sm:col-span-4 space-y-2 font-mono text-xs">
                  <div className="p-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                      Live Attacks:
                    </span>
                    <span className="font-bold text-rose-400">287</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      Monitored IPs:
                    </span>
                    <span className="font-bold text-cyan-300">1,42,001</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Blocked:
                    </span>
                    <span className="font-bold text-emerald-400">1,291</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 flex items-center justify-between">
                    <span className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                      <Globe className="w-3 h-3 text-indigo-400" />
                      Countries:
                    </span>
                    <span className="font-bold text-indigo-300">42</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 font-sans tracking-wide">
                  Network Overview
                </span>
                <button
                  onClick={() => onNavigate('telemetry')}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-5 my-2">
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-30" />
                  <div className="w-20 h-20 rounded-full border border-cyan-400/40 bg-cyan-950/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md">
                    <div className="w-14 h-14 rounded-full border border-cyan-400/60 bg-cyan-900/30 flex items-center justify-center">
                      <Wifi className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-mono min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                      Status:
                    </span>
                    <span className="font-bold text-white truncate max-w-[140px] text-right">
                      {displayName}'s Device
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="text-slate-400">IP Address:</span>
                    <span className="text-cyan-300 font-bold">172.20.10.2</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Gateway:</span>
                    <span className="text-slate-200">172.20.10.1</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Security:</span>
                    <span className="text-slate-200">WPA3-Personal</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Signal Strength:</span>
                    <span className="text-emerald-400 font-bold">-42 dBm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 hover:border-blue-400/50 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Code Auditor</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Scan source code for vulnerabilities using static analysis and AST inspection.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('analyzer')}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-blue-600/30 text-blue-300 hover:text-white border border-white/10 hover:border-blue-400/50 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all backdrop-blur-md shadow-sm"
              >
                <span>Start Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 hover:border-cyan-400/50 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">URL Auditor</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Analyze security headers, SSL/TLS, and phishing risks.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('urlaudit')}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-cyan-600/30 text-cyan-300 hover:text-white border border-white/10 hover:border-cyan-400/50 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all backdrop-blur-md shadow-sm"
              >
                <span>Scan URL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 hover:border-pink-400/50 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Payload Lab</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Test and learn real-world attack vectors safely.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('payloads')}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-pink-600/30 text-pink-300 hover:text-white border border-white/10 hover:border-pink-400/50 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all backdrop-blur-md shadow-sm"
              >
                <span>Open Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 hover:border-indigo-400/50 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col justify-between transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Security Agents</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Autonomous security agents for remediation, testing & monitoring.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('aiagents')}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-white/10 hover:border-indigo-400/50 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all backdrop-blur-md shadow-sm"
              >
                <span>Launch Agent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 2xl:col-span-3 space-y-5">
          <div className="bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-4 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-sans tracking-wide">
                  Live Threat Feed
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  Live
                </span>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto scrollbar-none pr-1">
              {threatEvents.map((evt) => {
                let dotClass = 'bg-rose-500 shadow-[0_0_6px_#f43f5e]';
                if (evt.color === 'amber') dotClass = 'bg-amber-500 shadow-[0_0_6px_#f59e0b]';
                if (evt.color === 'cyan') dotClass = 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]';

                return (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.06] transition-all flex items-start gap-2.5"
                  >
                    <span className={`w-2.5 h-2.5 rounded-sm mt-1 shrink-0 ${dotClass}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 text-xs">
                        <span className="font-bold text-white truncate">{evt.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{evt.time}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-300 truncate mt-0.5">
                        {evt.target}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => setIsFeedPaused(!isFeedPaused)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors backdrop-blur-md"
              >
                {isFeedPaused ? (
                  <>
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-amber-400" />
                    <span>Pause</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigate('telemetry')}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="bg-[#060e22]/45 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.37)] space-y-3 hover:border-cyan-500/30 transition-all">
            <div className="text-xs font-bold text-white font-sans tracking-wide pb-1">
              System Status
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10">
                <span className="text-slate-300">API Server</span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10">
                <span className="text-slate-300">Security Engine</span>
                <span className="flex items-center gap-1.5 text-cyan-400 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10">
                <span className="text-slate-300">Database</span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10">
                <span className="text-slate-300">Telemetry</span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10">
                <span className="text-slate-300">Background Jobs</span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  Online
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1 font-sans">
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  Live Network Telemetry
                </span>
                <button
                  onClick={() => onNavigate('telemetry')}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-0.5"
                >
                  <span>Configure</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">DEVICE / SSID:</span>
                  <span className="text-white font-bold truncate max-w-[150px]">
                    {network.name || network.deviceName || "Thanvan's iPhone Hotspot"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">LINK SPEED:</span>
                  <span className="text-emerald-400 font-bold">
                    {network.downlinkMbps ? `${network.downlinkMbps} Mbps` : network.linkSpeed || '866 Mbps'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">FREQUENCY:</span>
                  <span className="text-cyan-300 font-bold">
                    {network.frequency ? network.frequency.split(' ')[0] + ' ' + (network.frequency.split(' ')[1] || 'GHz') : '5.0 GHz'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">LOCAL IP:</span>
                  <span className="text-amber-300 font-bold">
                    {network.webrtcLocalCandidate || network.ipAddress || '172.20.10.2'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">RTT LATENCY:</span>
                  <span className="text-purple-300 font-bold">
                    {network.rttMs !== undefined ? `${network.rttMs} ms` : '22 ms'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 pb-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400 select-none">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>SaiVorex AI</span>
            <span className="text-[10px] text-slate-500 font-normal">v2.0.0</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300">Cyber Defense</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300">SAST</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300">DAST</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300">Live Telemetry</span>
        </div>

        <div className="flex items-center gap-3">
          <svg className="w-16 h-4 text-cyan-400" viewBox="0 0 100 20" fill="none">
            <path
              d="M0 10 H30 L38 2 L46 18 L54 6 L62 14 L68 10 H100"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[11px] text-slate-300 font-sans">
            Built for a Safer Tomorrow
          </span>
        </div>
      </div>
    </div>
  );
};
