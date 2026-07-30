import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { ScaleDriverFactory, ScaleFrameResult } from './hal/scale_driver.interface';

const prisma = new PrismaClient();

export type StabilityState = 'UNSTABLE' | 'STABILIZING' | 'STABLE';

interface ReadingBufferEntry {
  weightGrams: number;
  timestamp: number;
}

// In-Memory Stability Detector Buffer per Device
const deviceReadingBuffers = new Map<string, ReadingBufferEntry[]>();
const deviceTareState = new Map<string, number>();

export class WeightCaptureService {
  /**
   * 1. Register / Get Scale Device Configuration
   */
  static async registerScaleDevice(data: {
    deviceName: string;
    protocol?: 'RS232' | 'USB_SERIAL' | 'USB_HID' | 'WEBSERIAL';
    portName?: string;
    baudRate?: number;
    precisionGrams?: number;
    stabilityLockDurationMs?: number;
    jitterToleranceGrams?: number;
    maxCapacityGrams?: number;
    isDefault?: boolean;
  }) {
    return prisma.scaleDeviceConfig.create({
      data: {
        deviceName: data.deviceName,
        protocol: data.protocol || 'RS232',
        portName: data.portName || 'COM3',
        baudRate: data.baudRate || 9600,
        precisionGrams: data.precisionGrams || 0.01,
        stabilityLockDurationMs: data.stabilityLockDurationMs || 800,
        jitterToleranceGrams: data.jitterToleranceGrams || 0.005,
        maxCapacityGrams: data.maxCapacityGrams || 5000.0,
        isDefault: data.isDefault || false
      }
    });
  }

  static async getOrCreateDefaultDevice() {
    let device = await prisma.scaleDeviceConfig.findFirst({
      where: { isActive: true, isDefault: true }
    });

    if (!device) {
      device = await prisma.scaleDeviceConfig.findFirst({
        where: { isActive: true }
      });
    }

    if (!device) {
      device = await this.registerScaleDevice({
        deviceName: 'الميزان الرقمي الرئيسي (Mettler Toledo 0.01g)',
        protocol: 'RS232',
        portName: 'COM3',
        precisionGrams: 0.01,
        isDefault: true
      });
    }

    return device;
  }

  static async listScaleDevices() {
    return prisma.scaleDeviceConfig.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 5. Weight Stability Detection Engine (UNSTABLE -> STABILIZING -> STABLE)
   */
  static calculateStabilityState(
    deviceId: string,
    currentGrossWeight: number,
    lockDurationMs: number = 800,
    jitterTolerance: number = 0.005
  ): { state: StabilityState; isLocked: boolean; jitter: number } {
    const now = Date.now();
    let buffer = deviceReadingBuffers.get(deviceId) || [];

    // Keep entries within the lock duration window
    buffer = buffer.filter((entry) => now - entry.timestamp <= lockDurationMs);
    buffer.push({ weightGrams: currentGrossWeight, timestamp: now });
    deviceReadingBuffers.set(deviceId, buffer);

    if (buffer.length < 2) {
      return { state: 'STABILIZING', isLocked: false, jitter: 0 };
    }

    const weights = buffer.map((b) => b.weightGrams);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const jitter = parseFloat((maxWeight - minWeight).toFixed(4));

    const timeSpan = now - buffer[0].timestamp;

    if (jitter > jitterTolerance) {
      return { state: 'UNSTABLE', isLocked: false, jitter };
    }

    if (timeSpan >= lockDurationMs * 0.8) {
      return { state: 'STABLE', isLocked: true, jitter };
    }

    return { state: 'STABILIZING', isLocked: false, jitter };
  }

  /**
   * 7. Zero and Tare Operations
   */
  static async executeZero(deviceId: string) {
    deviceTareState.set(deviceId, 0);
    deviceReadingBuffers.delete(deviceId);
    return { success: true, message: 'Scale zeroed successfully', tareWeightGrams: 0 };
  }

  static async executeTare(deviceId: string, customTareGrams?: number) {
    const tareVal = customTareGrams !== undefined ? customTareGrams : 0;
    deviceTareState.set(deviceId, tareVal);
    return { success: true, message: 'Tare weight applied successfully', tareWeightGrams: tareVal };
  }

  /**
   * 11. Weight Fingerprint Generation (HMAC-SHA256)
   */
  static generateWeightFingerprint(params: {
    deviceId: string;
    timestamp: string;
    operatorName: string;
    grossWeightGrams: number;
    netWeightGrams: number;
    precisionGrams: number;
    stabilityState: string;
  }): { fingerprintHash: string; payloadJson: string } {
    const payload = {
      device: params.deviceId,
      timestamp: params.timestamp,
      operator: params.operatorName,
      gross: params.grossWeightGrams,
      net: params.netWeightGrams,
      precision: params.precisionGrams,
      stability: params.stabilityState
    };

    const payloadJson = JSON.stringify(payload);
    const fingerprintHash = crypto
      .createHmac('sha256', 'BAHER_SILVER_SCALE_FINGERPRINT_SECRET')
      .update(payloadJson)
      .digest('hex');

    return {
      fingerprintHash,
      payloadJson: JSON.stringify({ ...payload, signature: fingerprintHash })
    };
  }

  /**
   * 4. Complete Weight Processing & Audit Logging
   */
  static async processWeightReading(params: {
    deviceId?: string;
    rawFrame?: string;
    grossWeightGrams?: number;
    operatorId?: string;
    operatorName?: string;
    stationId?: string;
    mode?: 'SINGLE_LOCK' | 'CONTINUOUS';
    notes?: string;
  }) {
    const device = params.deviceId
      ? await prisma.scaleDeviceConfig.findUnique({ where: { id: params.deviceId } })
      : await this.getOrCreateDefaultDevice();

    if (!device) throw new Error('Scale Device configuration not found');

    const driver = ScaleDriverFactory.getDriver(device.protocol);

    // Parse input via HAL driver
    let parsed: ScaleFrameResult;
    if (params.rawFrame) {
      parsed = driver.parseFrame(params.rawFrame);
    } else {
      const gross = Number(params.grossWeightGrams || 0);
      parsed = {
        grossWeightGrams: gross,
        tareWeightGrams: deviceTareState.get(device.id) || 0,
        netWeightGrams: Math.max(0, parseFloat((gross - (deviceTareState.get(device.id) || 0)).toFixed(3))),
        unit: 'g',
        isStable: true,
        rawFrame: `MANUAL,GS,+${gross.toFixed(2)}g`
      };
    }

    const currentTare = deviceTareState.get(device.id) || parsed.tareWeightGrams || 0;
    const grossWeight = parsed.grossWeightGrams;
    const netWeight = Math.max(0, parseFloat((grossWeight - currentTare).toFixed(3)));

    // Calculate Stability State
    const stability = this.calculateStabilityState(
      device.id,
      grossWeight,
      device.stabilityLockDurationMs,
      device.jitterToleranceGrams
    );

    // 12. Tolerance Alerts Validation
    const alerts: string[] = [];
    if (grossWeight > device.maxCapacityGrams) {
      alerts.push(`OVER_CAPACITY_ALERT: Weight (${grossWeight}g) exceeds scale capacity (${device.maxCapacityGrams}g)`);
    }
    if (stability.jitter > device.jitterToleranceGrams * 3) {
      alerts.push(`HIGH_JITTER_ALERT: Vibration jitter (${stability.jitter}g) is high`);
    }

    const timestamp = new Date().toISOString();
    const fingerprint = this.generateWeightFingerprint({
      deviceId: device.id,
      timestamp,
      operatorName: params.operatorName || 'أمين المخزن',
      grossWeightGrams: grossWeight,
      netWeightGrams: netWeight,
      precisionGrams: device.precisionGrams,
      stabilityState: stability.state
    });

    // 10. Record Weight Audit Log
    const auditLog = await prisma.weightAuditLog.create({
      data: {
        deviceId: device.id,
        grossWeightGrams: grossWeight,
        tareWeightGrams: currentTare,
        netWeightGrams: netWeight,
        unit: 'g',
        stabilityState: stability.state,
        fingerprint: fingerprint.payloadJson,
        operatorId: params.operatorId || 'SYSTEM',
        operatorName: params.operatorName || 'أمين المخزن المختص',
        stationId: params.stationId || 'STATION-01',
        notes: alerts.length ? alerts.join(' | ') : params.notes || null
      }
    });

    return {
      auditLogId: auditLog.id,
      deviceId: device.id,
      deviceName: device.deviceName,
      protocol: device.protocol,
      grossWeightGrams: grossWeight,
      tareWeightGrams: currentTare,
      netWeightGrams: netWeight,
      unit: 'g',
      stabilityState: stability.state,
      isLocked: stability.isLocked,
      jitterGrams: stability.jitter,
      precisionGrams: device.precisionGrams,
      fingerprintHash: fingerprint.fingerprintHash,
      alerts,
      timestamp
    };
  }

  static async listAuditLogs(deviceId?: string) {
    const where: any = {};
    if (deviceId) where.deviceId = deviceId;

    return prisma.weightAuditLog.findMany({
      where,
      include: { scaleDevice: true },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }
}
