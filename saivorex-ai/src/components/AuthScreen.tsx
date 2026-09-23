import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Shield, Lock, Mail, User, Building, ArrowRight, CheckCircle2, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed. Unauthorized credentials.');
      }

      setSuccessMsg('Authentication successful! Loading security dashboard...');
      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login error occurred during authorization check.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !password.trim() || !organizationId.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (organizationId.trim().toLowerCase() !== 'sathan') {
      setErrorMsg('Invalid Organization ID. Default test ID is "sathan".');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          organizationId: organizationId.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Account registration failed.');
      }

      setSuccessMsg('Account verified & Organization ID authorized!');
      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Signup error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = (targetUser: 'thanvan' | 'sathan' = 'thanvan') => {
    if (targetUser === 'thanvan') {
      setName('Thanvan');
      setEmail('thanvan328@gmail.com');
      setPassword('SecurityPass2026!');
      setOrganizationId('sathan');
    } else {
      setName('Sathan Commander');
      setEmail('sathan@saivorex.ai');
      setPassword('SecurityPass2026!');
      setOrganizationId('sathan');
    }
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#070A12] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="relative w-20 h-20 mx-auto group flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/35 rounded-full blur-xl group-hover:bg-cyan-400/60 transition-all animate-pulse pointer-events-none" />
            <img
              src="/logo.png"
              alt="SaiVorex Logo"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedJpg) {
                  target.dataset.triedJpg = 'true';
                  target.src = '/logo.jpg';
                } else {
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove('hidden');
                }
              }}
              className="w-16 h-16 object-contain relative z-10 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.9)] transition-transform group-hover:scale-110"
            />
            <Shield className="hidden w-14 h-14 text-cyan-400 relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white font-mono tracking-tight">
              SaiVorex <span className="text-cyan-400">Core</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated Cybersecurity & Threat Intelligence Engine
            </p>
          </div>
        </div>

        <div className="bg-[#0B0F19]/90 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl space-y-6">
          <div className="grid grid-cols-2 p-1 bg-slate-900/80 border border-slate-800 rounded-full">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-mono font-bold rounded-full transition-all ${
                mode === 'login'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LOG IN
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-mono font-bold rounded-full transition-all ${
                mode === 'signup'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SIGN UP
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-xs flex items-center gap-2.5 font-sans">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs flex items-center gap-2.5 font-sans">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLoginSubmit : handleSignupSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-300 font-medium uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sathan Commander"
                  className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-300 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-300 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
              />
            </div>

            {mode === 'signup' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-slate-300 font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-amber-400" />
                    <span>Organization ID</span>
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">Test ID: sathan</span>
                </div>
                <input
                  type="text"
                  required
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  placeholder="Enter Organization ID (e.g. sathan)"
                  className="w-full bg-slate-900/90 border border-amber-500/30 focus:border-amber-400 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all font-sans"
                />
                <p className="text-[10px] text-slate-400 leading-tight">
                  Specific ID given by organization after payment. For test access use: <strong className="text-cyan-400 font-mono">sathan</strong>
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{mode === 'login' ? 'ACCESS DEFENSE DASHBOARD' : 'ACTIVATE ORGANIZATIONAL ACCOUNT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span className="text-[11px]">Quick Credentials:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleDemoFill('thanvan')}
                type="button"
                className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full text-[10px] font-mono transition-all font-bold"
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Thanvan</span>
              </button>
              <button
                onClick={() => handleDemoFill('sathan')}
                type="button"
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-full text-[10px] font-mono transition-all"
              >
                <span>Commander</span>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500 font-mono flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Encrypted 256-bit OWASP Compliant Gateway</span>
        </div>
      </div>
    </div>
  );
};
