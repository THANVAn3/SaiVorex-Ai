export type NetworkConnectionType = 'wifi' | 'ethernet' | 'cellular' | 'hotspot' | 'unknown';
export type NetworkSource = 'browser' | 'native' | 'server' | 'custom';

export interface NetworkStatus {
  connected: boolean;
  type: NetworkConnectionType;
  name: string | null;
  deviceName?: string | null;
  hotspotDeviceName?: string | null;
  hotspotDeviceIp?: string;
  source: NetworkSource;
  isHotspot?: boolean;
  ssid?: string;
  ipAddress?: string;
  gateway?: string;
  linkSpeed?: string;
  signalStrength?: string;
  detectionMode?: 'auto' | 'manual';
  frequency?: string;
  dns?: string;
  // Live Browser Telemetry Fields
  rttMs?: number;
  downlinkMbps?: number;
  effectiveType?: string;
  saveData?: boolean;
  publicIp?: string;
  webrtcLocalCandidate?: string;
  bandwidthLevel?: 'High-Speed Broadband' | 'Moderate' | 'Constrained' | 'Offline';
}

export interface ServerNetworkInfo {
  connected: boolean;
  type: NetworkConnectionType;
  name: string | null;
  deviceName?: string | null;
  hotspotDeviceIp?: string;
  hostname?: string;
  platform?: string;
  source: 'server';
  interfaces: Array<{
    name: string;
    address?: string;
    netmask?: string;
    mac?: string;
    type: NetworkConnectionType;
    family: string;
    internal: boolean;
  }>;
}
