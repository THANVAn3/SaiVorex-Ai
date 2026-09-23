import { NetworkStatus, NetworkConnectionType } from '../types/network';
import { NetworkAdapter, BrowserNetworkAdapter, ServerNetworkAdapter, NativeNetworkAdapter } from './networkAdapters';

class NetworkStatusService {
  private primaryAdapter: NetworkAdapter;
  private serverAdapter: NetworkAdapter;
  private listeners: Set<(status: NetworkStatus) => void> = new Set();
  private currentStatus: NetworkStatus = {
    connected: typeof navigator !== 'undefined' ? navigator.onLine : true,
    type: 'hotspot',
    name: "Thanvan's iPhone Hotspot",
    deviceName: "Thanvan's iPhone 15 Pro",
    hotspotDeviceName: "Thanvan's iPhone 15 Pro",
    hotspotDeviceIp: '172.20.10.1',
    ipAddress: '172.20.10.2',
    gateway: '172.20.10.1',
    source: 'browser',
    isHotspot: true,
    detectionMode: 'auto',
  };
  private unsubscribeAdapter: (() => void) | null = null;

  constructor() {
    this.primaryAdapter = new BrowserNetworkAdapter();
    this.serverAdapter = new ServerNetworkAdapter();
    this.init();
  }

  private init() {
    if (this.primaryAdapter.subscribe) {
      this.unsubscribeAdapter = this.primaryAdapter.subscribe((status) => {
        this.updateStatus(status);
      });
    }
    this.refresh();
  }

  public async refresh(): Promise<NetworkStatus> {
    try {
      const status = await this.primaryAdapter.getNetworkStatus();
      this.updateStatus(status);
      return status;
    } catch {
      const fallbackStatus: NetworkStatus = {
        connected: typeof navigator !== 'undefined' ? navigator.onLine : true,
        type: 'hotspot',
        name: "Thanvan's iPhone Hotspot",
        deviceName: "Thanvan's iPhone 15 Pro",
        hotspotDeviceName: "Thanvan's iPhone 15 Pro",
        hotspotDeviceIp: '172.20.10.1',
        ipAddress: '172.20.10.2',
        gateway: '172.20.10.1',
        source: 'browser',
        isHotspot: true,
        detectionMode: 'auto',
      };
      this.updateStatus(fallbackStatus);
      return fallbackStatus;
    }
  }

  public async fetchServerNetwork(): Promise<NetworkStatus> {
    try {
      return await this.serverAdapter.getNetworkStatus();
    } catch {
      return {
        connected: false,
        type: 'unknown',
        name: null,
        source: 'server',
      };
    }
  }

  public getStatus(): NetworkStatus {
    return this.currentStatus;
  }

  private updateStatus(newStatus: NetworkStatus) {
    this.currentStatus = newStatus;
    this.listeners.forEach((listener) => {
      try {
        listener(newStatus);
      } catch (e) {
        console.error('Error in networkStatus listener:', e);
      }
    });
  }

  public setNetworkConfig(config: {
    name?: string;
    deviceName?: string;
    hotspotDeviceIp?: string;
    clientIp?: string;
    type?: NetworkConnectionType;
    mode?: 'auto' | 'manual';
    isHotspot?: boolean;
  }) {
    if (typeof localStorage !== 'undefined') {
      if (config.name !== undefined) {
        localStorage.setItem('saivorex_network_name', config.name);
      }
      if (config.deviceName !== undefined) {
        localStorage.setItem('saivorex_hotspot_device_name', config.deviceName);
      }
      if (config.hotspotDeviceIp !== undefined) {
        localStorage.setItem('saivorex_hotspot_device_ip', config.hotspotDeviceIp);
      }
      if (config.clientIp !== undefined) {
        localStorage.setItem('saivorex_client_ip', config.clientIp);
      }
      if (config.type !== undefined) {
        localStorage.setItem('saivorex_network_type', config.type);
      }
      if (config.mode !== undefined) {
        localStorage.setItem('saivorex_network_mode', config.mode);
      }
    }
    this.refresh();
  }

  public setHotspotDetails(details: {
    deviceName?: string;
    hotspotDeviceIp?: string;
    networkSsid?: string;
    clientIp?: string;
  }) {
    this.setNetworkConfig({
      name: details.networkSsid,
      deviceName: details.deviceName,
      hotspotDeviceIp: details.hotspotDeviceIp,
      clientIp: details.clientIp,
      type: 'hotspot',
      isHotspot: true,
      mode: 'manual',
    });
  }

  public setNetworkName(name: string) {
    this.setNetworkConfig({ name, mode: 'manual' });
  }

  public setDeviceName(deviceName: string) {
    this.setNetworkConfig({ deviceName, mode: 'manual' });
  }

  public setHotspotDeviceIp(hotspotDeviceIp: string) {
    this.setNetworkConfig({ hotspotDeviceIp, mode: 'manual' });
  }

  public setNetworkType(
    type: NetworkConnectionType,
    options?: {
      networkName?: string;
      deviceName?: string;
      hotspotDeviceIp?: string;
      clientIp?: string;
    }
  ) {
    const isHotspot = type === 'hotspot' || type === 'cellular';
    let suggestedName = options?.networkName;
    let suggestedDeviceName = options?.deviceName;
    let suggestedDeviceIp = options?.hotspotDeviceIp;
    let suggestedClientIp = options?.clientIp;

    if (!suggestedName) {
      if (type === 'hotspot') suggestedName = "Thanvan's iPhone Hotspot";
      else if (type === 'ethernet') suggestedName = 'Gigabit_Ethernet_LAN';
      else if (type === 'wifi') suggestedName = 'Wi-Fi_Network_5G';
    }

    if (!suggestedDeviceName) {
      if (type === 'hotspot') suggestedDeviceName = "Thanvan's iPhone 15 Pro";
      else if (type === 'ethernet') suggestedDeviceName = 'Cisco Gigabit LAN Gateway';
      else if (type === 'wifi') suggestedDeviceName = 'Wi-Fi 6 Router AP';
    }

    if (!suggestedDeviceIp) {
      if (type === 'hotspot') suggestedDeviceIp = '172.20.10.1';
      else if (type === 'ethernet') suggestedDeviceIp = '10.0.0.1';
      else if (type === 'wifi') suggestedDeviceIp = '192.168.1.1';
    }

    if (!suggestedClientIp) {
      if (type === 'hotspot') suggestedClientIp = '172.20.10.2';
      else if (type === 'ethernet') suggestedClientIp = '10.0.0.15';
      else if (type === 'wifi') suggestedClientIp = '192.168.1.104';
    }

    this.setNetworkConfig({
      type,
      name: suggestedName,
      deviceName: suggestedDeviceName,
      hotspotDeviceIp: suggestedDeviceIp,
      clientIp: suggestedClientIp,
      mode: 'manual',
      isHotspot,
    });
  }

  public resetToAutoDetect() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('saivorex_network_name');
      localStorage.removeItem('saivorex_hotspot_device_name');
      localStorage.removeItem('saivorex_hotspot_device_ip');
      localStorage.removeItem('saivorex_client_ip');
      localStorage.removeItem('saivorex_network_type');
      localStorage.setItem('saivorex_network_mode', 'auto');
    }
    this.refresh();
  }

  public subscribe(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentStatus);

    return () => {
      this.listeners.delete(listener);
    };
  }

  public setAdapter(adapter: NetworkAdapter) {
    if (this.unsubscribeAdapter) {
      this.unsubscribeAdapter();
      this.unsubscribeAdapter = null;
    }
    this.primaryAdapter = adapter;
    if (this.primaryAdapter.subscribe) {
      this.unsubscribeAdapter = this.primaryAdapter.subscribe((status) => {
        this.updateStatus(status);
      });
    }
    this.refresh();
  }
}

export const networkStatusService = new NetworkStatusService();
export { BrowserNetworkAdapter, ServerNetworkAdapter, NativeNetworkAdapter };
