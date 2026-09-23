import { useState, useEffect, useCallback } from 'react';
import { NetworkStatus, NetworkConnectionType, NetworkSource } from '../types/network';
import { networkStatusService } from '../services/networkStatusService';

export interface UseNetworkStatusResult {
  connected: boolean;
  type: NetworkConnectionType;
  name: string | null;
  deviceName: string | null;
  hotspotDeviceName: string | null;
  hotspotDeviceIp: string;
  source: NetworkSource;
  isHotspot: boolean;
  ssid?: string;
  ipAddress?: string;
  gateway?: string;
  linkSpeed?: string;
  signalStrength?: string;
  frequency?: string;
  detectionMode?: 'auto' | 'manual';
  rttMs?: number;
  downlinkMbps?: number;
  effectiveType?: string;
  saveData?: boolean;
  publicIp?: string;
  webrtcLocalCandidate?: string;
  bandwidthLevel?: 'High-Speed Broadband' | 'Moderate' | 'Constrained' | 'Offline';
  isLoading: boolean;
  refresh: () => Promise<NetworkStatus>;
  fetchServerNetwork: () => Promise<NetworkStatus>;
  setNetworkName: (name: string) => void;
  setDeviceName: (deviceName: string) => void;
  setHotspotDeviceIp: (hotspotDeviceIp: string) => void;
  setHotspotDetails: (details: {
    deviceName?: string;
    hotspotDeviceIp?: string;
    networkSsid?: string;
    clientIp?: string;
  }) => void;
  setNetworkType: (
    type: NetworkConnectionType,
    options?: {
      networkName?: string;
      deviceName?: string;
      hotspotDeviceIp?: string;
      clientIp?: string;
    }
  ) => void;
  setNetworkConfig: (config: {
    name?: string;
    deviceName?: string;
    hotspotDeviceIp?: string;
    clientIp?: string;
    type?: NetworkConnectionType;
    mode?: 'auto' | 'manual';
    isHotspot?: boolean;
  }) => void;
  resetToAutoDetect: () => void;
}

export function useNetworkStatus(): UseNetworkStatusResult {
  const [status, setStatus] = useState<NetworkStatus>(() => networkStatusService.getStatus());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const updated = await networkStatusService.refresh();
      setStatus(updated);
      return updated;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchServerNetwork = useCallback(async () => {
    return await networkStatusService.fetchServerNetwork();
  }, []);

  const setNetworkName = useCallback((name: string) => {
    networkStatusService.setNetworkName(name);
  }, []);

  const setDeviceName = useCallback((deviceName: string) => {
    networkStatusService.setDeviceName(deviceName);
  }, []);

  const setHotspotDeviceIp = useCallback((hotspotDeviceIp: string) => {
    networkStatusService.setHotspotDeviceIp(hotspotDeviceIp);
  }, []);

  const setHotspotDetails = useCallback((details: {
    deviceName?: string;
    hotspotDeviceIp?: string;
    networkSsid?: string;
    clientIp?: string;
  }) => {
    networkStatusService.setHotspotDetails(details);
  }, []);

  const setNetworkType = useCallback((
    type: NetworkConnectionType,
    options?: {
      networkName?: string;
      deviceName?: string;
      hotspotDeviceIp?: string;
      clientIp?: string;
    }
  ) => {
    networkStatusService.setNetworkType(type, options);
  }, []);

  const setNetworkConfig = useCallback((config: {
    name?: string;
    deviceName?: string;
    hotspotDeviceIp?: string;
    clientIp?: string;
    type?: NetworkConnectionType;
    mode?: 'auto' | 'manual';
    isHotspot?: boolean;
  }) => {
    networkStatusService.setNetworkConfig(config);
  }, []);

  const resetToAutoDetect = useCallback(() => {
    networkStatusService.resetToAutoDetect();
  }, []);

  useEffect(() => {
    const unsubscribe = networkStatusService.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    refresh();

    return () => {
      unsubscribe();
    };
  }, [refresh]);

  const isHotspot = Boolean(status.isHotspot || status.type === 'hotspot' || status.type === 'cellular');

  return {
    connected: status.connected,
    type: status.type,
    name: status.name,
    deviceName: status.deviceName || status.hotspotDeviceName || null,
    hotspotDeviceName: status.hotspotDeviceName || status.deviceName || null,
    hotspotDeviceIp: status.hotspotDeviceIp || status.gateway || (isHotspot ? '172.20.10.1' : '192.168.1.1'),
    source: status.source,
    isHotspot,
    ssid: status.ssid || status.name || undefined,
    ipAddress: status.ipAddress || (isHotspot ? '172.20.10.2' : '192.168.1.104'),
    gateway: status.gateway || status.hotspotDeviceIp || (isHotspot ? '172.20.10.1' : '192.168.1.1'),
    linkSpeed: status.linkSpeed,
    signalStrength: status.signalStrength,
    frequency: status.frequency,
    detectionMode: status.detectionMode || 'auto',
    rttMs: status.rttMs,
    downlinkMbps: status.downlinkMbps,
    effectiveType: status.effectiveType,
    saveData: status.saveData,
    publicIp: status.publicIp,
    webrtcLocalCandidate: status.webrtcLocalCandidate,
    bandwidthLevel: status.bandwidthLevel,
    isLoading,
    refresh,
    fetchServerNetwork,
    setNetworkName,
    setDeviceName,
    setHotspotDeviceIp,
    setHotspotDetails,
    setNetworkType,
    setNetworkConfig,
    resetToAutoDetect,
  };
}
