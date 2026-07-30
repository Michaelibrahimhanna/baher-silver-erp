import { PrismaClient } from '@prisma/client';
import {
  DigitalScaleSimulator,
  BarcodePrinterSimulator,
  BarcodeScannerSimulator,
  CashDrawerSimulator,
  CustomerDisplaySimulator,
  ConnectionTestEngine,
  SimulationScenario
} from './hal/hardware_simulator.engine';

const prisma = new PrismaClient();

export interface CreateDeviceDTO {
  deviceCode: string;
  name: string;
  category: 'DIGITAL_SCALE' | 'BARCODE_PRINTER' | 'BARCODE_SCANNER' | 'CASH_DRAWER' | 'CUSTOMER_DISPLAY';
  brand: string;
  model: string;
  serialNumber: string;
  branchId?: string;
  stationId?: string;
  profileId?: string;
  driverId?: string;
  connectionType?: 'RS232' | 'USB_SERIAL' | 'USB_HID' | 'TCPIP' | 'WEBSERIAL' | 'BLUETOOTH';
  status?: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'CONNECTING' | 'ERROR' | 'MAINTENANCE';
  portName?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: string;
  ipAddress?: string;
  networkPort?: number;
  vendorId?: string;
  productId?: string;
  extraConfig?: string | object;
  isDefault?: boolean;
  autoReconnectEnabled?: boolean;
  maxReconnectAttempts?: number;
  reconnectIntervalMs?: number;
  backoffStrategy?: 'FIXED' | 'EXPONENTIAL';
}

export interface UpdateDeviceDTO {
  name?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  branchId?: string;
  stationId?: string;
  profileId?: string;
  driverId?: string;
  connectionType?: 'RS232' | 'USB_SERIAL' | 'USB_HID' | 'TCPIP' | 'WEBSERIAL' | 'BLUETOOTH';
  status?: 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'CONNECTING' | 'ERROR' | 'MAINTENANCE';
  portName?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: string;
  ipAddress?: string;
  networkPort?: number;
  vendorId?: string;
  productId?: string;
  extraConfig?: string | object;
  isDefault?: boolean;
  autoReconnectEnabled?: boolean;
  maxReconnectAttempts?: number;
  reconnectIntervalMs?: number;
  backoffStrategy?: 'FIXED' | 'EXPONENTIAL';
}

export interface CreateStationDTO {
  stationCode: string;
  name: string;
  branchId?: string;
  description?: string;
}

export interface CreateProfileDTO {
  profileCode: string;
  name: string;
  branchId?: string;
  description?: string;
  isDefaultProfile?: boolean;
}

export interface CreateDriverManifestDTO {
  driverCode: string;
  name: string;
  category: 'DIGITAL_SCALE' | 'BARCODE_PRINTER' | 'BARCODE_SCANNER' | 'CASH_DRAWER' | 'CUSTOMER_DISPLAY';
  version?: string;
  vendorIds?: string[] | string;
  productIds?: string[] | string;
  supportedProtocols?: string[] | string;
  supportedCommands?: string[] | string;
  capabilities?: string[] | string;
  osCompatibility?: string[] | string;
  configSchema?: string | object;
}

export interface RecordCalibrationDTO {
  calibratedBy: string;
  referenceWeightGrams: number;
  measuredWeightGrams: number;
  offsetErrorGrams?: number;
  status?: 'PASS' | 'FAIL' | 'ADJUSTED';
  certificateNo?: string;
  nextCalibrationDueDate?: Date | string;
  notes?: string;
}

export interface FirmwareUpdateDTO {
  firmwareVersion: string;
  firmwareBuildDate?: string;
  hardwareRevision?: string;
  manufacturer?: string;
  latestAvailableFirmwareVersion?: string;
  firmwareStatus?: 'UP_TO_DATE' | 'UPDATE_REQUIRED' | 'UPDATING';
}

export class HardwareDeviceService {
  // =============================================================================
  // AUDIT LOG HELPER
  // =============================================================================

  static async logAudit(
    deviceId: string | null,
    deviceCode: string | null,
    action: string,
    performedBy: string = 'SYSTEM',
    details?: string,
    metadata?: object | string
  ) {
    const metaStr = typeof metadata === 'object' ? JSON.stringify(metadata) : metadata;
    return await prisma.hardwareDeviceAuditLog.create({
      data: {
        deviceId,
        deviceCode,
        action,
        performedBy,
        details,
        metadata: metaStr
      }
    });
  }

  // =============================================================================
  // 1. HARDWARE DEVICE REGISTRY CRUD
  // =============================================================================

  static async registerDevice(data: CreateDeviceDTO, operatorName: string = 'SYSTEM') {
    const existing = await prisma.hardwareDeviceRegistry.findUnique({
      where: { deviceCode: data.deviceCode }
    });
    if (existing) {
      throw new Error(`Device code ${data.deviceCode} already exists.`);
    }

    const extraConfigStr = typeof data.extraConfig === 'object' 
      ? JSON.stringify(data.extraConfig) 
      : data.extraConfig;

    if (data.isDefault) {
      await prisma.hardwareDeviceRegistry.updateMany({
        where: {
          category: data.category,
          branchId: data.branchId || 'BRANCH-HQ',
          ...(data.stationId ? { stationId: data.stationId } : {})
        },
        data: { isDefault: false }
      });
    }

    const device = await prisma.hardwareDeviceRegistry.create({
      data: {
        deviceCode: data.deviceCode,
        name: data.name,
        category: data.category,
        brand: data.brand,
        model: data.model,
        serialNumber: data.serialNumber,
        branchId: data.branchId || 'BRANCH-HQ',
        stationId: data.stationId,
        profileId: data.profileId,
        driverId: data.driverId,
        connectionType: data.connectionType || 'RS232',
        status: data.status || 'OFFLINE',
        portName: data.portName || 'COM1',
        baudRate: data.baudRate || 9600,
        dataBits: data.dataBits || 8,
        stopBits: data.stopBits || 1,
        parity: data.parity || 'NONE',
        ipAddress: data.ipAddress,
        networkPort: data.networkPort,
        vendorId: data.vendorId,
        productId: data.productId,
        extraConfig: extraConfigStr,
        isDefault: data.isDefault || false,
        autoReconnectEnabled: data.autoReconnectEnabled ?? true,
        maxReconnectAttempts: data.maxReconnectAttempts ?? 5,
        reconnectIntervalMs: data.reconnectIntervalMs ?? 3000,
        backoffStrategy: data.backoffStrategy || 'EXPONENTIAL'
      },
      include: {
        station: true,
        profile: true,
        driver: true
      }
    });

    await this.logAudit(
      device.id,
      device.deviceCode,
      'REGISTER',
      operatorName,
      `Registered new hardware device '${device.name}' (${device.category})`
    );

    return device;
  }

  static async listDevices(filters?: {
    branchId?: string;
    stationId?: string;
    category?: string;
    status?: string;
    search?: string;
  }) {
    const where: any = {};
    if (filters?.branchId) where.branchId = filters.branchId;
    if (filters?.stationId) where.stationId = filters.stationId;
    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;

    if (filters?.search) {
      where.OR = [
        { deviceCode: { contains: filters.search } },
        { name: { contains: filters.search } },
        { brand: { contains: filters.search } },
        { model: { contains: filters.search } },
        { serialNumber: { contains: filters.search } }
      ];
    }

    return await prisma.hardwareDeviceRegistry.findMany({
      where,
      include: {
        station: true,
        profile: true,
        driver: true,
        calibrationLogs: {
          orderBy: { calibrationDate: 'desc' },
          take: 1
        },
        healthLogs: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getDeviceById(idOrCode: string) {
    const device = await prisma.hardwareDeviceRegistry.findFirst({
      where: {
        OR: [{ id: idOrCode }, { deviceCode: idOrCode }]
      },
      include: {
        station: true,
        profile: true,
        driver: true,
        calibrationLogs: {
          orderBy: { calibrationDate: 'desc' }
        },
        healthLogs: {
          orderBy: { timestamp: 'desc' },
          take: 10
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
    if (!device) throw new Error(`Hardware device not found for '${idOrCode}'`);
    return device;
  }

  static async updateDevice(idOrCode: string, data: UpdateDeviceDTO, operatorName: string = 'SYSTEM') {
    const device = await this.getDeviceById(idOrCode);

    const extraConfigStr = typeof data.extraConfig === 'object'
      ? JSON.stringify(data.extraConfig)
      : data.extraConfig;

    if (data.isDefault) {
      await prisma.hardwareDeviceRegistry.updateMany({
        where: {
          category: device.category,
          branchId: data.branchId || device.branchId,
          ...(data.stationId || device.stationId ? { stationId: data.stationId || device.stationId } : {})
        },
        data: { isDefault: false }
      });
    }

    const updated = await prisma.hardwareDeviceRegistry.update({
      where: { id: device.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.brand && { brand: data.brand }),
        ...(data.model && { model: data.model }),
        ...(data.serialNumber && { serialNumber: data.serialNumber }),
        ...(data.branchId && { branchId: data.branchId }),
        ...(data.stationId !== undefined && { stationId: data.stationId }),
        ...(data.profileId !== undefined && { profileId: data.profileId }),
        ...(data.driverId !== undefined && { driverId: data.driverId }),
        ...(data.connectionType && { connectionType: data.connectionType }),
        ...(data.status && { status: data.status }),
        ...(data.portName !== undefined && { portName: data.portName }),
        ...(data.baudRate !== undefined && { baudRate: data.baudRate }),
        ...(data.dataBits !== undefined && { dataBits: data.dataBits }),
        ...(data.stopBits !== undefined && { stopBits: data.stopBits }),
        ...(data.parity !== undefined && { parity: data.parity }),
        ...(data.ipAddress !== undefined && { ipAddress: data.ipAddress }),
        ...(data.networkPort !== undefined && { networkPort: data.networkPort }),
        ...(data.vendorId !== undefined && { vendorId: data.vendorId }),
        ...(data.productId !== undefined && { productId: data.productId }),
        ...(extraConfigStr !== undefined && { extraConfig: extraConfigStr }),
        ...(data.isDefault !== undefined && { isDefault: data.isDefault }),
        ...(data.autoReconnectEnabled !== undefined && { autoReconnectEnabled: data.autoReconnectEnabled }),
        ...(data.maxReconnectAttempts !== undefined && { maxReconnectAttempts: data.maxReconnectAttempts }),
        ...(data.reconnectIntervalMs !== undefined && { reconnectIntervalMs: data.reconnectIntervalMs }),
        ...(data.backoffStrategy && { backoffStrategy: data.backoffStrategy })
      },
      include: {
        station: true,
        profile: true,
        driver: true
      }
    });

    await this.logAudit(
      updated.id,
      updated.deviceCode,
      'UPDATE_CONFIG',
      operatorName,
      `Updated device configuration for '${updated.name}'`
    );

    return updated;
  }

  static async deleteDevice(idOrCode: string, operatorName: string = 'SYSTEM') {
    const device = await this.getDeviceById(idOrCode);
    
    await this.logAudit(
      device.id,
      device.deviceCode,
      'DELETE',
      operatorName,
      `Deleted device '${device.name}' (${device.deviceCode})`
    );

    return await prisma.hardwareDeviceRegistry.delete({
      where: { id: device.id }
    });
  }

  static async setDefaultDevice(idOrCode: string, operatorName: string = 'SYSTEM') {
    const device = await this.getDeviceById(idOrCode);

    await prisma.hardwareDeviceRegistry.updateMany({
      where: {
        category: device.category,
        branchId: device.branchId,
        ...(device.stationId ? { stationId: device.stationId } : {})
      },
      data: { isDefault: false }
    });

    const updated = await prisma.hardwareDeviceRegistry.update({
      where: { id: device.id },
      data: { isDefault: true }
    });

    await this.logAudit(
      updated.id,
      updated.deviceCode,
      'SET_DEFAULT',
      operatorName,
      `Assigned '${updated.name}' as default device for category ${updated.category}`
    );

    return updated;
  }

  // =============================================================================
  // 2. BRANCH -> STATION -> DEVICE HIERARCHY
  // =============================================================================

  static async createStation(data: CreateStationDTO) {
    const existing = await prisma.hardwareDeviceStation.findUnique({
      where: { stationCode: data.stationCode }
    });
    if (existing) {
      throw new Error(`Station code '${data.stationCode}' already exists.`);
    }

    return await prisma.hardwareDeviceStation.create({
      data: {
        stationCode: data.stationCode,
        name: data.name,
        branchId: data.branchId || 'BRANCH-HQ',
        description: data.description
      }
    });
  }

  static async listStations(branchId?: string) {
    return await prisma.hardwareDeviceStation.findMany({
      where: branchId ? { branchId } : {},
      include: {
        devices: true
      },
      orderBy: { stationCode: 'asc' }
    });
  }

  static async getStationById(idOrCode: string) {
    const station = await prisma.hardwareDeviceStation.findFirst({
      where: {
        OR: [{ id: idOrCode }, { stationCode: idOrCode }]
      },
      include: {
        devices: {
          include: { driver: true }
        }
      }
    });
    if (!station) throw new Error(`Station not found for '${idOrCode}'`);
    return station;
  }

  static async deleteStation(idOrCode: string) {
    const station = await this.getStationById(idOrCode);
    return await prisma.hardwareDeviceStation.delete({
      where: { id: station.id }
    });
  }

  // =============================================================================
  // 3. HARDWARE DEVICE PROFILES PER BRANCH
  // =============================================================================

  static async createProfile(data: CreateProfileDTO) {
    const existing = await prisma.hardwareDeviceProfile.findUnique({
      where: { profileCode: data.profileCode }
    });
    if (existing) {
      throw new Error(`Profile code '${data.profileCode}' already exists.`);
    }

    if (data.isDefaultProfile) {
      await prisma.hardwareDeviceProfile.updateMany({
        where: { branchId: data.branchId || 'BRANCH-HQ' },
        data: { isDefaultProfile: false }
      });
    }

    return await prisma.hardwareDeviceProfile.create({
      data: {
        profileCode: data.profileCode,
        name: data.name,
        branchId: data.branchId || 'BRANCH-HQ',
        description: data.description,
        isDefaultProfile: data.isDefaultProfile || false
      }
    });
  }

  static async listProfiles(branchId?: string) {
    return await prisma.hardwareDeviceProfile.findMany({
      where: branchId ? { branchId } : {},
      include: {
        devices: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getProfileById(idOrCode: string) {
    const profile = await prisma.hardwareDeviceProfile.findFirst({
      where: {
        OR: [{ id: idOrCode }, { profileCode: idOrCode }]
      },
      include: {
        devices: true
      }
    });
    if (!profile) throw new Error(`Profile not found for '${idOrCode}'`);
    return profile;
  }

  // =============================================================================
  // 4. DRIVER REGISTRY & DRIVER MANIFESTS
  // =============================================================================

  static async registerDriverManifest(data: CreateDriverManifestDTO) {
    const existing = await prisma.hardwareDriverManifest.findUnique({
      where: { driverCode: data.driverCode }
    });
    if (existing) {
      throw new Error(`Driver manifest code '${data.driverCode}' already exists.`);
    }

    const arrayToStr = (val: string[] | string | undefined, defaultVal: string) => {
      if (!val) return defaultVal;
      if (Array.isArray(val)) return JSON.stringify(val);
      return val;
    };

    return await prisma.hardwareDriverManifest.create({
      data: {
        driverCode: data.driverCode,
        name: data.name,
        category: data.category,
        version: data.version || '1.0.0',
        vendorIds: arrayToStr(data.vendorIds, '[]'),
        productIds: arrayToStr(data.productIds, '[]'),
        supportedProtocols: arrayToStr(data.supportedProtocols, '["RS232"]'),
        supportedCommands: arrayToStr(data.supportedCommands, '[]'),
        capabilities: arrayToStr(data.capabilities, '[]'),
        osCompatibility: arrayToStr(data.osCompatibility, '["WINDOWS", "LINUX"]'),
        configSchema: typeof data.configSchema === 'object' ? JSON.stringify(data.configSchema) : data.configSchema
      }
    });
  }

  static async listDriverManifests(category?: string) {
    return await prisma.hardwareDriverManifest.findMany({
      where: category ? { category } : {},
      include: {
        devices: true
      },
      orderBy: { name: 'asc' }
    });
  }

  static async getDriverManifestById(idOrCode: string) {
    const driver = await prisma.hardwareDriverManifest.findFirst({
      where: {
        OR: [{ id: idOrCode }, { driverCode: idOrCode }]
      },
      include: {
        devices: true
      }
    });
    if (!driver) throw new Error(`Driver manifest not found for '${idOrCode}'`);
    return driver;
  }

  static async bindDeviceDriver(deviceIdOrCode: string, driverIdOrCode: string, operatorName: string = 'SYSTEM') {
    const device = await this.getDeviceById(deviceIdOrCode);
    const driver = await this.getDriverManifestById(driverIdOrCode);

    if (device.category !== driver.category) {
      throw new Error(`Category mismatch: Device is '${device.category}' but Driver is '${driver.category}'`);
    }

    const updated = await prisma.hardwareDeviceRegistry.update({
      where: { id: device.id },
      data: { driverId: driver.id },
      include: { driver: true, station: true, profile: true }
    });

    await this.logAudit(
      updated.id,
      updated.deviceCode,
      'DRIVER_BIND',
      operatorName,
      `Bound driver manifest '${driver.name}' (${driver.driverCode}) to device`
    );

    return updated;
  }

  // =============================================================================
  // 5. MAINTENANCE MODE LIFECYCLE
  // =============================================================================

  static async setMaintenanceMode(idOrCode: string, inMaintenance: boolean, reason?: string, operatorName: string = 'SYSTEM') {
    const device = await this.getDeviceById(idOrCode);
    const newStatus = inMaintenance ? 'MAINTENANCE' : 'OFFLINE';

    const updated = await prisma.hardwareDeviceRegistry.update({
      where: { id: device.id },
      data: {
        status: newStatus,
        statusReason: inMaintenance ? (reason || 'Scheduled Maintenance') : null
      },
      include: { station: true, driver: true }
    });

    await this.logAudit(
      updated.id,
      updated.deviceCode,
      'MAINTENANCE',
      operatorName,
      `Set maintenance mode = ${inMaintenance} (${reason || 'N/A'})`
    );

    return updated;
  }

  // =============================================================================
  // 6. CALIBRATION HISTORY
  // =============================================================================

  static async recordCalibration(idOrCode: string, data: RecordCalibrationDTO) {
    const device = await this.getDeviceById(idOrCode);

    const calculatedOffset = data.offsetErrorGrams !== undefined
      ? data.offsetErrorGrams
      : Math.abs(data.measuredWeightGrams - data.referenceWeightGrams);

    let status = data.status;
    if (!status) {
      status = calculatedOffset <= 0.05 ? 'PASS' : 'FAIL';
    }

    const calibrationLog = await prisma.deviceCalibrationLog.create({
      data: {
        deviceId: device.id,
        calibratedBy: data.calibratedBy,
        referenceWeightGrams: data.referenceWeightGrams,
        measuredWeightGrams: data.measuredWeightGrams,
        offsetErrorGrams: calculatedOffset,
        status: status,
        certificateNo: data.certificateNo,
        nextCalibrationDueDate: data.nextCalibrationDueDate ? new Date(data.nextCalibrationDueDate) : null,
        notes: data.notes
      }
    });

    await this.logAudit(
      device.id,
      device.deviceCode,
      'CALIBRATE',
      data.calibratedBy,
      `Recorded calibration check (Status: ${status}, Measured: ${data.measuredWeightGrams}g)`
    );

    return calibrationLog;
  }

  static async listCalibrationLogs(idOrCode: string) {
    const device = await this.getDeviceById(idOrCode);
    return await prisma.deviceCalibrationLog.findMany({
      where: { deviceId: device.id },
      orderBy: { calibrationDate: 'desc' }
    });
  }

  // =============================================================================
  // 7. SPRINT 03.2: DEVICE HEALTH MONITORING & PING
  // =============================================================================

  static async pingDevice(idOrCode: string, pingType: string = 'MANUAL_PING') {
    const device = await this.getDeviceById(idOrCode);

    // If device is in maintenance mode, ping reports maintenance state
    if (device.status === 'MAINTENANCE') {
      const responseTimeMs = 12.0;
      await prisma.hardwareDeviceHealthLog.create({
        data: {
          deviceId: device.id,
          status: 'MAINTENANCE',
          responseTimeMs,
          pingType,
          errorMessage: device.statusReason || 'Device in scheduled maintenance',
          healthScore: 50.0
        }
      });
      return {
        deviceId: device.id,
        deviceCode: device.deviceCode,
        status: 'MAINTENANCE',
        responseTimeMs,
        healthScore: 50.0,
        lastPingAt: new Date()
      };
    }

    // Simulate connection ping measurement
    const responseTimeMs = Math.round((Math.random() * 20 + 8) * 100) / 100; // e.g. 8.5ms - 28.5ms
    let newStatus = 'ONLINE';
    let healthScore = 100.0;
    let errorMessage: string | undefined = undefined;

    if (responseTimeMs > 25) {
      newStatus = 'DEGRADED';
      healthScore = 75.0;
    }

    const updatedDevice = await prisma.hardwareDeviceRegistry.update({
      where: { id: device.id },
      data: {
        status: newStatus,
        lastPingAt: new Date(),
        healthScore,
        reconnectAttemptsCount: 0
      }
    });

    await prisma.hardwareDeviceHealthLog.create({
      data: {
        deviceId: device.id,
        status: newStatus,
        responseTimeMs,
        pingType,
        healthScore
      }
    });

    await this.logAudit(
      device.id,
      device.deviceCode,
      'HEALTH_PING',
      'HEARTBEAT_SERVICE',
      `Device ping successful (Latency: ${responseTimeMs}ms, Status: ${newStatus})`
    );

    return {
      deviceId: updatedDevice.id,
      deviceCode: updatedDevice.deviceCode,
      status: updatedDevice.status,
      responseTimeMs,
      healthScore,
      lastPingAt: updatedDevice.lastPingAt
    };
  }

  static async systemHeartbeat(branchId?: string) {
    const devices = await prisma.hardwareDeviceRegistry.findMany({
      where: {
        ...(branchId ? { branchId } : {}),
        isActive: true
      }
    });

    const results = [];
    for (const dev of devices) {
      const pingRes = await this.pingDevice(dev.id, 'HEARTBEAT');
      results.push(pingRes);
    }

    return await this.getHealthSummary(branchId);
  }

  static async getHealthSummary(branchId?: string) {
    const devices = await prisma.hardwareDeviceRegistry.findMany({
      where: branchId ? { branchId } : {}
    });

    const totalDevices = devices.length;
    const onlineCount = devices.filter(d => d.status === 'ONLINE').length;
    const offlineCount = devices.filter(d => d.status === 'OFFLINE').length;
    const degradedCount = devices.filter(d => d.status === 'DEGRADED').length;
    const errorCount = devices.filter(d => d.status === 'ERROR').length;
    const maintenanceCount = devices.filter(d => d.status === 'MAINTENANCE').length;
    const connectingCount = devices.filter(d => d.status === 'CONNECTING').length;

    const avgHealthScore = totalDevices > 0
      ? Math.round((devices.reduce((acc, d) => acc + d.healthScore, 0) / totalDevices) * 100) / 100
      : 100.0;

    return {
      branchId: branchId || 'ALL',
      totalDevices,
      onlineCount,
      offlineCount,
      degradedCount,
      errorCount,
      maintenanceCount,
      connectingCount,
      overallHealthScore: avgHealthScore,
      devicesSummary: devices.map(d => ({
        id: d.id,
        deviceCode: d.deviceCode,
        name: d.name,
        category: d.category,
        status: d.status,
        healthScore: d.healthScore,
        lastPingAt: d.lastPingAt
      }))
    };
  }

  // =============================================================================
  // 8. SPRINT 03.2: AUTO RECONNECT ENGINE
  // =============================================================================

  static async attemptAutoReconnect(idOrCode: string, forceSuccess: boolean = true) {
    const device = await this.getDeviceById(idOrCode);

    if (!device.autoReconnectEnabled) {
      throw new Error(`Auto reconnect is disabled for device '${device.deviceCode}'`);
    }

    // Set status to CONNECTING
    await prisma.hardwareDeviceRegistry.update({
      where: { id: device.id },
      data: { status: 'CONNECTING' }
    });

    const nextAttempt = device.reconnectAttemptsCount + 1;
    let backoffDelayMs = device.reconnectIntervalMs;
    if (device.backoffStrategy === 'EXPONENTIAL') {
      backoffDelayMs = device.reconnectIntervalMs * Math.pow(2, Math.min(nextAttempt - 1, 6));
    }

    await this.logAudit(
      device.id,
      device.deviceCode,
      'RECONNECT_ATTEMPT',
      'AUTO_RECONNECT_ENGINE',
      `Attempting reconnect (Attempt ${nextAttempt}/${device.maxReconnectAttempts}, Backoff: ${backoffDelayMs}ms)`
    );

    if (forceSuccess || nextAttempt <= device.maxReconnectAttempts) {
      const reconnectedDevice = await prisma.hardwareDeviceRegistry.update({
        where: { id: device.id },
        data: {
          status: 'ONLINE',
          lastPingAt: new Date(),
          healthScore: 100.0,
          reconnectAttemptsCount: 0,
          lastErrorMessage: null
        }
      });

      await prisma.hardwareDeviceHealthLog.create({
        data: {
          deviceId: device.id,
          status: 'ONLINE',
          responseTimeMs: 14.5,
          pingType: 'RECONNECT_TRY',
          healthScore: 100.0
        }
      });

      return {
        success: true,
        message: 'Device successfully reconnected and online',
        device: reconnectedDevice,
        attempt: nextAttempt,
        backoffDelayMs
      };
    } else {
      const errorDevice = await prisma.hardwareDeviceRegistry.update({
        where: { id: device.id },
        data: {
          status: 'ERROR',
          healthScore: 0.0,
          reconnectAttemptsCount: nextAttempt,
          lastErrorAt: new Date(),
          lastErrorMessage: `Auto reconnect failed after ${nextAttempt} attempts.`
        }
      });

      await prisma.hardwareDeviceHealthLog.create({
        data: {
          deviceId: device.id,
          status: 'ERROR',
          responseTimeMs: 0.0,
          pingType: 'RECONNECT_TRY',
          errorMessage: errorDevice.lastErrorMessage || undefined,
          healthScore: 0.0
        }
      });

      return {
        success: false,
        message: errorDevice.lastErrorMessage,
        device: errorDevice,
        attempt: nextAttempt,
        backoffDelayMs
      };
    }
  }

  // =============================================================================
  // 9. SPRINT 03.2: FIRMWARE TRACKING & MANAGEMENT
  // =============================================================================

  static async updateFirmwareInfo(idOrCode: string, data: FirmwareUpdateDTO, operatorName: string = 'SYSTEM') {
    const device = await this.getDeviceById(idOrCode);

    const updateAvailable = data.latestAvailableFirmwareVersion
      ? data.latestAvailableFirmwareVersion !== data.firmwareVersion
      : false;

    const firmwareStatus = data.firmwareStatus || (updateAvailable ? 'UPDATE_REQUIRED' : 'UP_TO_DATE');

    const updated = await prisma.hardwareDeviceRegistry.update({
      where: { id: device.id },
      data: {
        firmwareVersion: data.firmwareVersion,
        ...(data.firmwareBuildDate && { firmwareBuildDate: data.firmwareBuildDate }),
        ...(data.hardwareRevision && { hardwareRevision: data.hardwareRevision }),
        ...(data.manufacturer && { manufacturer: data.manufacturer }),
        ...(data.latestAvailableFirmwareVersion && { latestAvailableFirmwareVersion: data.latestAvailableFirmwareVersion }),
        updateAvailable,
        firmwareStatus
      }
    });

    await this.logAudit(
      updated.id,
      updated.deviceCode,
      'FIRMWARE_UPDATE',
      operatorName,
      `Firmware info updated: ${updated.firmwareVersion} (Status: ${updated.firmwareStatus})`
    );

    return updated;
  }

  // =============================================================================
  // 10. SPRINT 03.2: HARDWARE AUDIT LOGS QUERY
  // =============================================================================

  static async listAuditLogs(filters?: {
    deviceId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};
    if (filters?.deviceId) where.deviceId = filters.deviceId;
    if (filters?.action) where.action = filters.action;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    return await prisma.hardwareDeviceAuditLog.findMany({
      where,
      include: {
        device: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // =============================================================================
  // 11. SPRINT 03.3: HARDWARE SIMULATOR ENGINE & CONNECTION TEST API
  // =============================================================================

  static async testConnection(idOrCode: string, forceFail: boolean = false, operatorName: string = 'SYSTEM') {
    const device = await this.getDeviceById(idOrCode);
    const result = await ConnectionTestEngine.executeHandshake(
      device.id,
      device.deviceCode,
      device.category,
      device.connectionType,
      device.driver?.driverCode,
      device.portName || device.ipAddress || 'COM1',
      device.baudRate || device.networkPort || 9600,
      forceFail
    );

    await this.logAudit(
      device.id,
      device.deviceCode,
      'TEST_CONNECTION',
      operatorName,
      `Executed connection test (Status: ${result.status}, Latency: ${result.latencyMs}ms)`
    );

    return result;
  }

  static async executeSimulation(
    idOrCode: string,
    action: string,
    payload: any = {},
    scenario: SimulationScenario = 'SUCCESS',
    operatorName: string = 'SYSTEM'
  ) {
    const device = await this.getDeviceById(idOrCode);

    let simulationResult: any;

    switch (device.category) {
      case 'DIGITAL_SCALE': {
        if (action === 'TARE') {
          simulationResult = await DigitalScaleSimulator.setTare(device.id, payload.tareWeightGrams || 2.50);
        } else if (action === 'ZERO') {
          simulationResult = await DigitalScaleSimulator.zeroScale(device.id);
        } else {
          simulationResult = await DigitalScaleSimulator.pollWeight(device.id, {
            scenario,
            grossWeightGrams: payload.grossWeightGrams,
            tareWeightGrams: payload.tareWeightGrams,
            isStable: payload.isStable,
            operatorName
          });
        }
        break;
      }

      case 'BARCODE_PRINTER': {
        simulationResult = await BarcodePrinterSimulator.printTag(device.id, {
          scenario,
          tagData: payload.tagData,
          copies: payload.copies,
          paperStatus: payload.paperStatus,
          operatorName
        });
        break;
      }

      case 'BARCODE_SCANNER': {
        simulationResult = await BarcodeScannerSimulator.triggerScan(device.id, {
          scenario,
          barcodePayload: payload.barcodePayload,
          barcodeFormat: payload.barcodeFormat,
          operatorName
        });
        break;
      }

      case 'CASH_DRAWER': {
        simulationResult = await CashDrawerSimulator.openDrawer(device.id, {
          scenario,
          pulsePin: payload.pulsePin,
          pulseDurationMs: payload.pulseDurationMs,
          operatorName
        });
        break;
      }

      case 'CUSTOMER_DISPLAY': {
        simulationResult = await CustomerDisplaySimulator.displayText(device.id, {
          scenario,
          line1: payload.line1,
          line2: payload.line2,
          operatorName
        });
        break;
      }

      default:
        throw new Error(`Unsupported hardware simulator category '${device.category}'`);
    }

    await this.logAudit(
      device.id,
      device.deviceCode,
      'SIMULATE_ACTION',
      operatorName,
      `Executed simulator action '${action}' (${device.category}, Scenario: ${scenario})`
    );

    return {
      deviceId: device.id,
      deviceCode: device.deviceCode,
      category: device.category,
      action,
      scenario,
      simulationResult
    };
  }

  static getSimulatorEngineStatus() {
    return {
      status: 'ACTIVE',
      engineVersion: '3.3.0',
      supportedCategories: [
        'DIGITAL_SCALE',
        'BARCODE_PRINTER',
        'BARCODE_SCANNER',
        'CASH_DRAWER',
        'CUSTOMER_DISPLAY'
      ],
      supportedScenarios: ['SUCCESS', 'TIMEOUT', 'OFFLINE', 'ERROR'],
      isolationMode: 'STRICT_HAL_ISOLATED',
      timestamp: new Date()
    };
  }
}

