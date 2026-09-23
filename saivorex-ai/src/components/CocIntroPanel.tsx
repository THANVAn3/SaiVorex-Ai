import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Target, Zap, Activity, Radio, ChevronRight, Play, Cpu, Lock } from 'lucide-react';

interface CocIntroPanelProps {
  userName?: string;
  onComplete: () => void;
}

export const CocIntroPanel: React.FC<CocIntroPanelProps> = ({ userName = 'Commander', onComplete }) => {
  const [stage, setStage] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const t1 = setTimeout(() => setStage(2), 1600); // Logo Zoom & Laser Lock
    const t2 = setTimeout(() => setStage(3), 3600); // Defense HUD Grid
    const t3 = setTimeout(() => setStage(4), 5400); // Battle Start Banner
    const t4 = setTimeout(() => onComplete(), 7200); // Auto enter app

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#070A12] text-white overflow-hidden flex flex-col justify-between p-6 font-mono select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/30 via-[#070a12]/90 to-[#070a12] pointer-events-none" />
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none animate-pulse" 
      />

      <div className="relative z-10 flex items-center justify-between border-b border-cyan-500/30 pb-4 bg-[#070a12]/80 backdrop-blur-md px-4 py-2 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="w-5 h-5 text-cyan-400 animate-spin" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-cyan-400 tracking-wider">
              SAIVOREX • BASE SCOUTING HUD
            </span>
            <p className="text-[10px] text-slate-400 font-sans">
              Welcome back, <span className="text-amber-400 font-bold">{userName}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80 hover:text-cyan-400 transition-all active:scale-95"
        >
          <span>SKIP INTRO</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
        
        {stage === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/50 animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-red-500/40 animate-[spin_4s_linear_infinite_reverse]" />
              <Target className="w-12 h-12 text-red-500 animate-pulse" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-red-400 tracking-widest uppercase flex items-center justify-center gap-2">
                <Activity className="w-4 h-4 animate-bounce" />
                <span>LOCATING SAIVOREX DEFENSE GRID...</span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Sweeping OWASP threat quadrants & initializing SAST engine...
              </p>
            </div>
          </motion.div>
        )}

        {(stage === 2 || stage === 3 || stage === 4) && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative space-y-6"
          >
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 via-blue-600/20 to-purple-500/30 rounded-full blur-2xl animate-pulse pointer-events-none" />
              <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-[spin_12s_linear_infinite] pointer-events-none" />
              <div className="absolute inset-6 rounded-full border border-dashed border-red-500/40 animate-[spin_16s_linear_infinite_reverse] pointer-events-none" />

              <motion.img
                src="/logo.png"
                alt="SaiVorex Logo"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.dataset.triedJpg) {
                    target.dataset.triedJpg = 'true';
                    target.src = '/logo.jpg';
                  } else {
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.classList.remove('hidden');
                  }
                }}
                animate={{ y: [-5, 5, -5], scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain relative z-10 filter drop-shadow-[0_0_25px_rgba(6,182,212,0.95)]"
              />
              <Shield className="hidden w-28 h-28 sm:w-36 sm:h-36 text-cyan-400 relative z-10 drop-shadow-[0_0_25px_rgba(6,182,212,0.95)]" />

              <motion.div
                initial={{ top: '10%' }}
                animate={{ top: ['15%', '85%', '15%'] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] pointer-events-none z-20"
              />

              <div className="absolute -inset-2 border border-cyan-500/30 rounded-full pointer-events-none flex items-center justify-between p-2">
                <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
                <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400" />
              </div>
            </div>

            <div className="space-y-2">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase"
              >
                SaiVorex <span className="text-cyan-400">Core</span> Threat Engine
              </motion.h1>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-sans">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[11px]">
                  DEFENSE LEVEL 10
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-mono">SAST ARMED</span>
              </div>
            </div>

            {stage >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3 max-w-md mx-auto pt-2"
              >
                <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-left flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">DEFENSE GRID</div>
                    <div className="text-xs font-bold text-emerald-400">100% ONLINE</div>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-left flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">OWASP ENGINE</div>
                    <div className="text-xs font-bold text-cyan-400">ARMED & SCANNING</div>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-left flex items-center gap-2.5">
                  <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">ORANGE MATRIX</div>
                    <div className="text-xs font-bold text-amber-300">ORG SECURE</div>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-left flex items-center gap-2.5">
                  <Zap className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">EXPLOIT SHIELD</div>
                    <div className="text-xs font-bold text-red-400">ACTIVE FIREWALL</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {stage === 4 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="pt-4"
          >
            <button
              onClick={onComplete}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>ENTER BASE DEFENSE HEADQUARTERS</span>
            </button>
          </motion.div>
        )}
      </div>

      <div className="relative z-10 max-w-xl mx-auto w-full space-y-2 bg-[#070a12]/80 backdrop-blur-md p-3 border border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>SYNCHRONIZING BASE TELEMETRY...</span>
          </span>
          <span className="text-slate-400 font-bold">{progress}%</span>
        </div>

        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
