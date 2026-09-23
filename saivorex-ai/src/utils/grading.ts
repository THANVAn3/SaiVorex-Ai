export interface GradeInfo {
  grade: 'O' | 'A' | 'B' | 'C' | 'F';
  gradePoint: number; // e.g. 10.0, 8.8, 6.5, 0.0 on a 10.0 scale
  label: string; // "Outstanding", "Excellent", "Good", etc.
  badgeClass: string;
  borderClass: string;
  bgGlowClass: string;
  description: string;
}

export function computeGrade(score: number): GradeInfo {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const gradePoint = Number((clamped / 10).toFixed(1));

  if (clamped >= 90) {
    return {
      grade: 'O',
      gradePoint,
      label: 'Outstanding Defense',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      borderClass: 'border-emerald-500/50',
      bgGlowClass: 'from-emerald-500/15 via-slate-900/90 to-slate-950 border-emerald-500/40 text-emerald-400',
      description: 'Enterprise-grade security header configuration meeting rigorous transport and browser defense benchmarks.',
    };
  } else if (clamped >= 75) {
    return {
      grade: 'A',
      gradePoint,
      label: 'Excellent / Very Good',
      badgeClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      borderClass: 'border-cyan-500/50',
      bgGlowClass: 'from-cyan-500/15 via-slate-900/90 to-slate-950 border-cyan-500/40 text-cyan-400',
      description: 'Robust defense configuration with strong transport security; minor hardening steps recommended.',
    };
  } else if (clamped >= 60) {
    return {
      grade: 'B',
      gradePoint,
      label: 'Good / Moderate',
      badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      borderClass: 'border-amber-500/50',
      bgGlowClass: 'from-amber-500/15 via-slate-900/90 to-slate-950 border-amber-500/40 text-amber-400',
      description: 'Acceptable baseline, but missing critical policies like strict Content Security Policy (CSP) or HSTS.',
    };
  } else if (clamped >= 45) {
    return {
      grade: 'C',
      gradePoint,
      label: 'Average / Needs Hardening',
      badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      borderClass: 'border-orange-500/50',
      bgGlowClass: 'from-orange-500/15 via-slate-900/90 to-slate-950 border-orange-500/40 text-orange-400',
      description: 'Elevated attack surface risk with inadequate headers against framing, MIME-sniffing, or clickjacking.',
    };
  } else {
    return {
      grade: 'F',
      gradePoint,
      label: 'Fail / Critical Exposure',
      badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
      borderClass: 'border-red-500/50',
      bgGlowClass: 'from-red-500/15 via-slate-900/90 to-slate-950 border-red-500/40 text-red-400',
      description: 'Severely vulnerable or unencrypted endpoint exposed to packet sniffing, credential theft, and spoofing.',
    };
  }
}

export function getHeaderGrade(status: 'PASS' | 'WARN' | 'FAIL'): {
  grade: 'O' | 'B' | 'F';
  gradePoint: number;
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case 'PASS':
      return {
        grade: 'O',
        gradePoint: 10.0,
        label: 'Grade O (10.0 GP) - Compliant',
        badgeClass: 'bg-emerald-950/80 text-emerald-400 border-emerald-700/80',
      };
    case 'WARN':
      return {
        grade: 'B',
        gradePoint: 6.0,
        label: 'Grade B (6.0 GP) - Suboptimal',
        badgeClass: 'bg-amber-950/80 text-amber-400 border-amber-700/80',
      };
    case 'FAIL':
      return {
        grade: 'F',
        gradePoint: 0.0,
        label: 'Grade F (0.0 GP) - Missing / Insecure',
        badgeClass: 'bg-red-950/80 text-red-400 border-red-700/80',
      };
  }
}

export const GRADE_SCALE_LEGEND = [
  { grade: 'O', label: 'Outstanding', minScore: 90, gradePoint: '9.0 - 10.0 GP', color: 'text-emerald-400', border: 'border-emerald-500/30' },
  { grade: 'A', label: 'Excellent', minScore: 75, gradePoint: '7.5 - 8.9 GP', color: 'text-cyan-400', border: 'border-cyan-500/30' },
  { grade: 'B', label: 'Good / Moderate', minScore: 60, gradePoint: '6.0 - 7.4 GP', color: 'text-amber-400', border: 'border-amber-500/30' },
  { grade: 'C', label: 'Needs Improvement', minScore: 45, gradePoint: '4.5 - 5.9 GP', color: 'text-orange-400', border: 'border-orange-500/30' },
  { grade: 'F', label: 'Fail / Critical', minScore: 0, gradePoint: '0.0 - 4.4 GP', color: 'text-red-400', border: 'border-red-500/30' },
];
