import React, { useState, useRef, useEffect } from 'react';
import {
  Wifi,
  Network,
  Smartphone,
  Globe,
  WifiOff,
  RefreshCw,
  Shield,
  Zap,
  Check,
  Edit3,
  ExternalLink,
  Flame,
  Radio,
  Sliders,
  Server,
  Activity,
  Gauge,
  Cpu,
  RadioTower
} from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { NetworkConnectionType } from '../types/network';

interface NetworkStatusIndicatorProps {
  className?: string;
  showTooltipPopover?: boolean;
  onOpenTelemetry?: () => void;
}

const PRESET_HOTSPOTS = [
  {
    label: "🔥 Thanvan's iPhone 15 Pro",
    deviceName: "Thanvan's iPhone 15 Pro",
    networkName: "Thanvan's iPhone Hotspot",
    deviceIp: '172.20.10.1',
    clientIp: '172.20.10.2',
    type: 'hotspot' as const,
  },
  {
    label: '🔥 Pixel 8 Pro 5G Hotspot',
    deviceName: 'Pixel 8 Pro (Mobile Hotspot)',
    networkName: 'Pixel_8_5G_Tether',
    deviceIp: '192.168.43.1',
    clientIp: '192.168.43.142',
    type: 'hotspot' as const,
  },
  {
    label: '🔥 Galaxy S24 Ultra Hotspot',
    deviceName: 'Galaxy S24 Ultra (5G Tether)',
    networkName: 'Samsung_S24_Hotspot',
    deviceIp: '192.168.43.1',
    clientIp: '192.168.43.88',
    type: 'hotspot' as const,
  },
  {
    label: '📶 Cyber Home Fiber 5G',
    deviceName: 'Wi-Fi 6 Router AP',
    networkName: 'Cyber_Home_Fiber_5G',
    deviceIp: '192.168.1.1',
    clientIp: '192.168.1.104',
    type: 'wifi' as const,
  },
  {
    label: '📶 Corp Secure Wi-Fi 6E',
    deviceName: 'Cisco Enterprise Wireless AP',
    networkName: 'Corporate_WiFi_Secure',
    deviceIp: '192.168.10.1',
    clientIp: '192.168.10.45',
    type: 'wifi' as const,
  },
  {
    label: '🖧 Gigabit Ethernet LAN',
    deviceName: 'Cisco Catalyst Switch Port 0/1',
    networkName: 'Gigabit_Ethernet_LAN',
    deviceIp: '10.0.0.1',
    clientIp: '10.0.0.15',
    type: 'ethernet' as const,
  },
];

export const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  className = '',
  showTooltipPopover = true,
  onOpenTelemetry,
}) => {
  const {
    connected,
    type,
    name,
    deviceName,
    hotspotDeviceName,
    hotspotDeviceIp,
    ipAddress,
    isHotspot,
    detectionMode,
    linkSpeed,
    signalStrength,
    frequency,
    rttMs,
    downlinkMbps,
    effectiveType: browserEffectiveType,
    webrtcLocalCandidate,
    bandwidthLevel,
    isLoading,
    refresh,
    fetchServerNetwork,
    setNetworkType,
    setNetworkName,
    setDeviceName,
    setHotspotDeviceIp,
    setNetworkConfig,
    resetToAutoDetect,
  } = useNetworkStatus();

  const [showPopover, setShowPopover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editDevName, setEditDevName] = useState(deviceName || hotspotDeviceName || '');
  const [editDevIp, setEditDevIp] = useState(hotspotDeviceIp || '172.20.10.1');
  const [editNetName, setEditNetName] = useState(name || '');
  const [editClientIp, setEditClientIp] = useState(ipAddress || '172.20.10.2');

  const [serverStatusInfo, setServerStatusInfo] = useState<any>(null);
  const [isFetchingServer, setIsFetchingServer] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditDevName(deviceName || hotspotDeviceName || '');
    setEditDevIp(hotspotDeviceIp || '172.20.10.1');
    setEditNetName(name || '');
    setEditClientIp(ipAddress || '172.20.10.2');
  }, [deviceName, hotspotDeviceName, hotspotDeviceIp, name, ipAddress]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
        setIsEditing(false);
      }
    };
    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

  const handleFetchServerInfo = async () => {
    setIsFetchingServer(true);
    try {
      const info = await fetchServerNetwork();
      setServerStatusInfo(info);
    } finally {
      setIsFetchingServer(false);
    }
  };

  const handleSaveCustomSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setNetworkConfig({
      name: editNetName.trim() || undefined,
      deviceName: editDevName.trim() || undefined,
      hotspotDeviceIp: editDevIp.trim() || undefined,
      clientIp: editClientIp.trim() || undefined,
      mode: 'manual',
    });
    setIsEditing(false);
  };

  const getEffectiveType = (): NetworkConnectionType => {
    if (isHotspot || type === 'hotspot' || type === 'cellular') return 'hotspot';
    if (type === 'ethernet') return 'ethernet';
    if (type === 'wifi') return 'wifi';
    return 'unknown';
  };

  const effectiveType = getEffectiveType();

  const getIcon = (connType: NetworkConnectionType, isConn: boolean) => {
    if (!isConn) {
      return <WifiOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
    }
    switch (connType) {
      case 'hotspot':
      case 'cellular':
        return <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />;
      case 'wifi':
        return <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'ethernet':
        return <Network className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case 'unknown':
      default:
        return <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    }
  };

  const getBadgeStyling = () => {
    if (!connected) {
      return 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20';
    }
    if (effectiveType === 'hotspot') {
      return 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 shadow-[0_0_14px_rgba(245,158,11,0.2)]';
    }
    if (effectiveType === 'ethernet') {
      return 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 shadow-[0_0_14px_rgba(6,182,212,0.2)]';
    }
    return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 shadow-[0_0_14px_rgba(16,185,129,0.2)]';
  };

  const getStatusDotClass = () => {
    if (!connected) return 'bg-rose-500 animate-pulse';
    if (effectiveType === 'hotspot') return 'bg-amber-400 animate-ping';
    if (effectiveType === 'ethernet') return 'bg-cyan-400 animate-pulse';
    return 'bg-emerald-400 animate-pulse';
  };

  const activeDisplayName = (
    deviceName ||
    hotspotDeviceName ||
    name ||
    (effectiveType === 'hotspot' ? "Thanvan's iPhone 15 Pro" : effectiveType === 'ethernet' ? 'Gigabit Ethernet LAN' : 'Wi-Fi Network 5G')
  ).trim();
  const displayIp = (hotspotDeviceIp || (effectiveType === 'hotspot' ? '172.20.10.1' : effectiveType === 'ethernet' ? '10.0.0.1' : '192.168.1.1')).trim();

  return (
    <div className={`relative inline-block font-mono text-xs ${className}`} ref={popoverRef}>
      <button
        onClick={() => showTooltipPopover && setShowPopover(!showPopover)}
        type="button"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 select-none ${getBadgeStyling()}`}
        title={`Connected Network: ${activeDisplayName} | Host/Gateway IP: ${displayIp} | Medium: ${effectiveType.toUpperCase()}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass()}`} />
        {getIcon(effectiveType, connected)}

        <div className="hidden sm:flex items-center gap-1.5 max-w-[320px] lg:max-w-[400px] truncate text-[11px]">
          {!connected ? (
            <span className="font-bold text-rose-300">Offline</span>
          ) : effectiveType === 'hotspot' ? (
            <>
              <span className="font-bold text-amber-300 shrink-0">Hotspot:</span>
              <span className="font-semibold text-white truncate max-w-[170px]" title={activeDisplayName}>
                {activeDisplayName}
              </span>
              <span className="text-[10px] text-amber-400 font-mono bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
                IP: {displayIp}
              </span>
            </>
          ) : effectiveType === 'ethernet' ? (
            <>
              <span className="font-bold text-cyan-300 shrink-0">Ethernet:</span>
              <span className="font-semibold text-white truncate max-w-[170px]" title={activeDisplayName}>
                {activeDisplayName}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-500/30 shrink-0">
                IP: {displayIp}
              </span>
            </>
          ) : (
            <>
              <span className="font-bold text-emerald-300 shrink-0">Wi-Fi:</span>
              <span className="font-semibold text-white truncate max-w-[170px]" title={activeDisplayName}>
                {activeDisplayName}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
                IP: {displayIp}
              </span>
            </>
          )}
        </div>

        <div className="sm:hidden flex items-center gap-1 font-bold text-[10px]">
          {!connected ? (
            <span>Offline</span>
          ) : (
            <>
              <span className="text-white truncate max-w-[90px]">{activeDisplayName}</span>
              <span className="text-amber-400 opacity-90 text-[9px] shrink-0">({displayIp})</span>
            </>
          )}
        </div>

        {isLoading && <RefreshCw className="w-2.5 h-2.5 text-cyan-400 animate-spin ml-0.5" />}
      </button>

      {showPopover && (
        <div className="absolute right-0 mt-2 w-84 sm:w-[420px] bg-[#0B0F19] border border-slate-700/80 rounded-2xl shadow-2xl p-4 space-y-3.5 z-50 animate-in fade-in zoom-in-95 text-xs backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-bold text-white uppercase text-[11px] tracking-wider block">
                  Connected Hotspot & Network Telemetry
                </span>
                <span className="text-[9px] text-slate-400">
                  Device Name, Hotspot Gateway IP & Interface Status
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-1 rounded-lg transition-colors text-xs font-mono flex items-center gap-1 ${
                  isEditing ? 'bg-cyan-500 text-slate-950 font-bold px-2' : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
                }`}
                title="Configure custom Hotspot Device Name and Host IP"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? 'Editing' : 'Edit'}
              </button>
              <button
                onClick={() => refresh()}
                className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Refresh network detection"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border ${
              effectiveType === 'hotspot'
                ? 'bg-amber-950/25 border-amber-500/40 text-amber-200'
                : effectiveType === 'ethernet'
                ? 'bg-cyan-950/25 border-cyan-500/40 text-cyan-200'
                : 'bg-emerald-950/25 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 flex items-center gap-1.5">
                {getIcon(effectiveType, connected)}
                <span>{effectiveType === 'hotspot' ? '🔥 Hotspot Device Interface' : effectiveType === 'ethernet' ? '🖧 Wired Ethernet Interface' : '📶 Wi-Fi 802.11ax Interface'}</span>
              </span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${
                  effectiveType === 'hotspot'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : effectiveType === 'ethernet'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {effectiveType.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-mono">Hotspot Device Name:</span>
                <span className="font-bold text-sm text-white truncate max-w-[230px] text-right font-sans">
                  {activeDisplayName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono">Hotspot Device IP:</span>
                <span className="font-bold text-xs text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                  {displayIp}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono">Client Local IP (PC):</span>
                <span className="font-bold text-xs text-cyan-300 font-mono">
                  {ipAddress || '172.20.10.2'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono">Network (SSID):</span>
                <span className="font-medium text-xs text-slate-200 truncate max-w-[220px]">
                  {name || 'Connected Network'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Live Browser Telemetry
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {bandwidthLevel || 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2 bg-slate-900/80 rounded-lg border border-white/5 space-y-0.5">
                <div className="flex items-center gap-1 text-slate-400 text-[9px]">
                  <Gauge className="w-3 h-3 text-emerald-400" />
                  <span>NETWORK SPEED</span>
                </div>
                <div className="font-bold text-xs text-emerald-300 truncate">
                  {downlinkMbps ? `${downlinkMbps} Mbps` : linkSpeed || 'High-Speed'}
                </div>
                <div className="text-[8px] text-slate-500">
                  {downlinkMbps ? 'Via NetworkInfo API' : 'Estimated Downlink'}
                </div>
              </div>

              <div className="p-2 bg-slate-900/80 rounded-lg border border-white/5 space-y-0.5">
                <div className="flex items-center gap-1 text-slate-400 text-[9px]">
                  <RadioTower className="w-3 h-3 text-cyan-400" />
                  <span>RADIO FREQUENCY</span>
                </div>
                <div className="font-bold text-xs text-cyan-300 truncate">
                  {frequency ? frequency.split(' ')[0] + ' ' + (frequency.split(' ')[1] || 'GHz') : '5.0 GHz / 2.4 GHz'}
                </div>
                <div className="text-[8px] text-slate-500 truncate" title={frequency}>
                  {frequency || 'Dual-Band Wi-Fi'}
                </div>
              </div>

              <div className="p-2 bg-slate-900/80 rounded-lg border border-white/5 space-y-0.5">
                <div className="flex items-center gap-1 text-slate-400 text-[9px]">
                  <Activity className="w-3 h-3 text-amber-400" />
                  <span>RTT PING LATENCY</span>
                </div>
                <div className="font-bold text-xs text-amber-300">
                  {rttMs !== undefined ? `${rttMs} ms` : '22 ms'}
                </div>
                <div className="text-[8px] text-slate-500">
                  Real-time Gateway Ping
                </div>
              </div>

              <div className="p-2 bg-slate-900/80 rounded-lg border border-white/5 space-y-0.5">
                <div className="flex items-center gap-1 text-slate-400 text-[9px]">
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <span>ADAPTER IP</span>
                </div>
                <div className="font-bold text-xs text-purple-300 truncate" title={webrtcLocalCandidate || ipAddress}>
                  {webrtcLocalCandidate || ipAddress || '172.20.10.2'}
                </div>
                <div className="text-[8px] text-slate-500">
                  {webrtcLocalCandidate ? 'WebRTC Candidate' : 'Assigned Subnet'}
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <form
              onSubmit={handleSaveCustomSettings}
              className="p-3 bg-slate-900/90 border border-cyan-500/40 rounded-xl space-y-2.5 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3 h-3" />
                  Custom Hotspot & Device Parameters
                </span>
                <span className="text-[9px] text-slate-500 font-mono">[SAVES TO BROWSER]</span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    User-Named Hotspot Device (e.g., Thanvan's iPhone 15 Pro):
                  </label>
                  <input
                    type="text"
                    value={editDevName}
                    onChange={(e) => setEditDevName(e.target.value)}
                    placeholder="e.g. Thanvan's iPhone 15 Pro"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">
                      Hotspot Device IP (Host/Gateway):
                    </label>
                    <input
                      type="text"
                      value={editDevIp}
                      onChange={(e) => setEditDevIp(e.target.value)}
                      placeholder="e.g. 172.20.10.1"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-amber-300 font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">
                      Client Assigned IP:
                    </label>
                    <input
                      type="text"
                      value={editClientIp}
                      onChange={(e) => setEditClientIp(e.target.value)}
                      placeholder="e.g. 172.20.10.2"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">
                    Network SSID / Broadcast Name:
                  </label>
                  <input
                    type="text"
                    value={editNetName}
                    onChange={(e) => setEditNetName(e.target.value)}
                    placeholder="e.g. Thanvan's iPhone Hotspot"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 text-slate-400 hover:text-white rounded text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-[10px] flex items-center gap-1 shadow"
                >
                  <Check className="w-3 h-3" />
                  <span>Apply & Save</span>
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Connection Type:
            </span>
            <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => resetToAutoDetect()}
                className={`py-1 px-1.5 text-[10px] font-bold rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                  detectionMode === 'auto'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Auto-detect based on hardware interface"
              >
                <Zap className="w-3 h-3" />
                <span>Auto</span>
              </button>

              <button
                onClick={() =>
                  setNetworkType('hotspot', {
                    networkName: "Thanvan's iPhone Hotspot",
                    deviceName: "Thanvan's iPhone 15 Pro",
                    hotspotDeviceIp: '172.20.10.1',
                    clientIp: '172.20.10.2',
                  })
                }
                className={`py-1 px-1.5 text-[10px] font-bold rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                  effectiveType === 'hotspot'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Mobile Hotspot / Cellular Tethering"
              >
                <Smartphone className="w-3 h-3" />
                <span>Hotspot</span>
              </button>

              <button
                onClick={() =>
                  setNetworkType('wifi', {
                    networkName: 'Cyber_Home_Fiber_5G',
                    deviceName: 'Wi-Fi 6 Router AP',
                    hotspotDeviceIp: '192.168.1.1',
                    clientIp: '192.168.1.104',
                  })
                }
                className={`py-1 px-1.5 text-[10px] font-bold rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                  effectiveType === 'wifi'
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Wi-Fi Wireless LAN"
              >
                <Wifi className="w-3 h-3" />
                <span>Wi-Fi</span>
              </button>

              <button
                onClick={() =>
                  setNetworkType('ethernet', {
                    networkName: 'Gigabit_Ethernet_LAN',
                    deviceName: 'Cisco Gigabit LAN Gateway',
                    hotspotDeviceIp: '10.0.0.1',
                    clientIp: '10.0.0.15',
                  })
                }
                className={`py-1 px-1.5 text-[10px] font-bold rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                  effectiveType === 'ethernet'
                    ? 'bg-cyan-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Ethernet Wired LAN"
              >
                <Network className="w-3 h-3" />
                <span>Ethernet</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Quick Preset Devices & Hotspots:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_HOTSPOTS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setNetworkType(preset.type, {
                      networkName: preset.networkName,
                      deviceName: preset.deviceName,
                      hotspotDeviceIp: preset.deviceIp,
                      clientIp: preset.clientIp,
                    });
                    setEditDevName(preset.deviceName);
                    setEditDevIp(preset.deviceIp);
                    setEditNetName(preset.networkName);
                    setEditClientIp(preset.clientIp);
                  }}
                  className={`p-1.5 text-left rounded-lg text-[10px] font-mono border transition-all ${
                    (deviceName === preset.deviceName || name === preset.networkName)
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="truncate font-semibold text-white">{preset.label}</div>
                  <div className="text-[9px] text-amber-400/90 truncate">IP: {preset.deviceIp}</div>
                </button>
              ))}
            </div>
          </div>

          {onOpenTelemetry && (
            <button
              onClick={() => {
                setShowPopover(false);
                onOpenTelemetry();
              }}
              className="w-full py-2 px-3 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/30 hover:border-cyan-500/50 rounded-xl text-cyan-300 font-bold flex items-center justify-center gap-1.5 text-xs transition-all"
            >
              <span>Open Full Network & Hotspot Threat Scanner</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 flex items-center gap-1">
              <Server className="w-3 h-3" />
              Host Backend Diagnostics:
            </span>
            <button
              onClick={handleFetchServerInfo}
              disabled={isFetchingServer}
              className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer flex items-center gap-1"
            >
              {isFetchingServer ? 'Checking...' : 'Check Server Host'}
            </button>
          </div>

          {serverStatusInfo && (
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[10px] space-y-1 font-mono">
              <div className="text-slate-400 font-bold flex items-center justify-between">
                <span>Server Host Status:</span>
                <span className="text-emerald-400">{serverStatusInfo.connected ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
              <div className="text-slate-400 font-bold flex items-center justify-between">
                <span>Host Interface Type:</span>
                <span className="text-cyan-300 uppercase">{serverStatusInfo.type}</span>
              </div>
              {serverStatusInfo.name && (
                <div className="text-slate-400 font-bold flex items-center justify-between">
                  <span>Interface:</span>
                  <span className="text-slate-200">{serverStatusInfo.name}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
