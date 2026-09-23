export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface CodeFinding {
  id: string;
  title: string;
  severity: Severity;
  cwe: string;
  owaspCategory: string;
  lineRange: [number, number];
  description: string;
  exploitScenario: string;
  remediation: string;
}

export interface CodeAnalysisResult {
  id?: string;
  scannedAt?: string;
  securityScore: number; // 0 to 100
  llmConfidence?: number; // realistic model confidence rating 0 to 100
  totalVulnerabilities: number;
  severityCounts: Record<Severity, number>;
  summary: string;
  findings: CodeFinding[];
  remediatedCode: string;
  keyTakeaways: string[];
}

export interface HeaderCheck {
  headerName: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  grade?: 'O' | 'A' | 'B' | 'C' | 'F' | string;
  gradePoint?: number;
  value?: string;
  recommendedValue: string;
  description: string;
  severity: Severity;
}

export interface PhishingAnalysis {
  safetyPercentage: number; // e.g. 88 (88% safe)
  isPhishingSuspected: boolean;
  statusText: 'SAFE' | 'LOW RISK' | 'PHISHING SUSPECTED' | 'MALICIOUS / UNTRUSTED';
  phishingRiskFactors: string[];
}

export interface UrlScanResult {
  id?: string;
  url: string;
  scannedAt: string;
  overallScore: number;
  grade?: 'O' | 'A' | 'B' | 'C' | 'F' | string;
  gradePoint?: number;
  gradeDescription?: string;
  llmConfidence?: number;
  riskLevel: Severity;
  phishingAnalysis?: PhishingAnalysis;
  headers: HeaderCheck[];
  serverTechDiscovered: string[];
  vulnerabilitiesFound: string[];
  aiRecommendations: string[];
}

export interface OwaspItem {
  id: string; // e.g. "A01:2021"
  name: string;
  title: string;
  description: string;
  impact: string;
  vulnerableCodeSample: string;
  secureCodeSample: string;
  preventionSteps: string[];
  cweReferences: string[];
}

export interface CodeSamplePreset {
  id: string;
  title: string;
  language: string;
  category: string;
  description: string;
  code: string;
}

export interface SavedReport {
  id: string;
  projectId?: string;
  title: string;
  generatedAt: string;
  score: number;
  criticals: number;
  highs: number;
  mediums: number;
  summary: string;
  contentMarkdown?: string;
}

export interface SecurityProject {
  id: string;
  name: string;
  description: string;
  targetType: 'web_app' | 'source_code' | 'api_gateway' | 'network' | 'full_suite';
  status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
  securityScore: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  createdAt: string;
  updatedAt: string;
  lastScanDate: string;
  codeAudits: CodeAnalysisResult[];
  urlAudits: UrlScanResult[];
  owaspAssessment?: Record<string, 'PASS' | 'WARN' | 'FAIL' | 'UNTESTED'>;
  payloadTests?: { payload: string; category: string; result: string; timestamp: string }[];
  reports?: SavedReport[];
}

export type ActiveTab =
  | 'dashboard'
  | 'projects'
  | 'analyzer'
  | 'urlaudit'
  | 'owasp'
  | 'payloads'
  | 'reports'
  | 'telemetry'
  | 'threatintel'
  | 'aiagents'
  | 'settings'
  | 'profile'
  | 'help'
  | 'showcase';

export interface UserProfile {
  name: string;
  email: string;
  organizationId: string;
  isLoggedIn: boolean;
  token?: string;
  createdAt?: string;
  role?: string;
}

export interface SystemStatus {
  geminiOnline: boolean;
  apiServerOnline: boolean;
  databaseOnline: boolean;
  telemetryConnected: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

export interface ProjectTimelineNode {
  id: string;
  title: string;
  type: 'audit' | 'url_scan' | 'report' | 'milestone' | 'remediation' | 'payload_test';
  timestamp: string;
  relativeTime: string;
  status: 'passed' | 'warning' | 'critical' | 'completed' | 'in_progress';
  score?: number;
  scoreDelta?: number;
  summary: string;
  details?: string;
  findingsCount?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  tags?: string[];
  findings?: Array<{
    id: string;
    title: string;
    severity: string;
    cwe?: string;
    remediation?: string;
  }>;
  codeSnippet?: string;
}
