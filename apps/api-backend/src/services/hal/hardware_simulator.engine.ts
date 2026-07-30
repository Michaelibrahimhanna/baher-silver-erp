/**
 * EPIC 02 SPRINT 03.3: HARDWARE SIMULATOR ENGINE & HAL INTERFACES
 * Isolated simulator implementations for all 5 hardware categories:
 * 1. Digital Scale Simulator
 * 2. Barcode Printer Simulator
 * 3. Barcode Scanner Simulator
 * 4. Cash Drawer Simulator
 * 5. Customer Display Simulator
 */

export type SimulationScenario = 'SUCCESS' | 'TIMEOUT' | 'OFFLINE' | 'ERROR';

export interface BaseSimulationRequest {
  scenario?: SimulationScenario;
  operatorName?: string;
}

// =============================================================================
// 1. DIGITAL SCALE SIMULATOR
// =============================================================================
export interface ScalePollRequest extends BaseSimulationRequest {
  grossWeightGrams?: number;
  tareWeightGrams?: number;
  precisionGrams?: number;
  isStable?: boolean;
}

export interface ScalePollResponse {
  deviceId: string;
  grossWeightGrams: number;
  tareWeightGrams: number;
  netWeightGrams: number;
  unit: string;
  isStable: boolean;
  stabilityState: 'STABLE' | 'UNSTABLE' | 'STABILIZING';
  rawFrame: string;
  timestamp: Date;
}

export class DigitalScaleSimulator {
  private static tareMemory: Map<string, number> = new Map();

  static async pollWeight(deviceId: string, req: ScalePollRequest = {}): Promise<ScalePollResponse> {
    const scenario = req.scenario || 'SUCCESS';

    if (scenario === 'OFFLINE') {
      throw new Error(`[SCALE_SIMULATOR] Device '${deviceId}' is OFFLINE or disconnected.`);
    }

    if (scenario === 'TIMEOUT') {
      await new Promise(r => setTimeout(r, 4500));
      throw new Error(`[SCALE_SIMULATOR] Device '${deviceId}' communication TIMEOUT (>4000ms).`);
    }

    if (scenario === 'ERROR') {
      throw new Error(`[SCALE_SIMULATOR] Scale sensor error: OUT_OF_RANGE_OVERLOAD.`);
    }

    const currentTare = req.tareWeightGrams !== undefined 
      ? req.tareWeightGrams 
      : (this.tareMemory.get(deviceId) || 0.0);

    const rawGross = req.grossWeightGrams !== undefined ? req.grossWeightGrams : 14.85;
    const gross = Math.round(rawGross * 100) / 100;
    const net = Math.round(Math.max(0, gross - currentTare) * 100) / 100;
    const isStable = req.isStable !== undefined ? req.isStable : true;

    const rawFrame = `ST,GS,+${gross.toFixed(2).padStart(7, '0')}g`;

    return {
      deviceId,
      grossWeightGrams: gross,
      tareWeightGrams: currentTare,
      netWeightGrams: net,
      unit: 'g',
      isStable,
      stabilityState: isStable ? 'STABLE' : 'UNSTABLE',
      rawFrame,
      timestamp: new Date()
    };
  }

  static async setTare(deviceId: string, tareWeightGrams: number): Promise<{ deviceId: string; tareWeightGrams: number }> {
    this.tareMemory.set(deviceId, tareWeightGrams);
    return { deviceId, tareWeightGrams };
  }

  static async zeroScale(deviceId: string): Promise<{ deviceId: string; zeroed: boolean }> {
    this.tareMemory.set(deviceId, 0.0);
    return { deviceId, zeroed: true };
  }
}

// =============================================================================
// 2. BARCODE PRINTER SIMULATOR
// =============================================================================
export interface PrintTagRequest extends BaseSimulationRequest {
  tagData?: {
    sku?: string;
    serialNo?: string;
    titleAr?: string;
    weightGrams?: number;
    silverPurity?: string;
    priceEgp?: number;
  };
  copies?: number;
  paperStatus?: 'PAPER_OK' | 'PAPER_LOW' | 'PAPER_OUT';
}

export interface PrintTagResponse {
  deviceId: string;
  jobId: string;
  status: 'COMPLETED' | 'FAILED' | 'QUEUED';
  copiesPrinted: number;
  paperStatus: 'PAPER_OK' | 'PAPER_LOW' | 'PAPER_OUT';
  dpiResolution: number;
  simulatedZplCommands: string;
  timestamp: Date;
}

export class BarcodePrinterSimulator {
  private static printCounter: Map<string, number> = new Map();

  static async printTag(deviceId: string, req: PrintTagRequest = {}): Promise<PrintTagResponse> {
    const scenario = req.scenario || 'SUCCESS';

    if (scenario === 'OFFLINE') {
      throw new Error(`[PRINTER_SIMULATOR] Printer '${deviceId}' is OFFLINE or unplugged.`);
    }

    if (scenario === 'TIMEOUT') {
      await new Promise(r => setTimeout(r, 4500));
      throw new Error(`[PRINTER_SIMULATOR] Printer '${deviceId}' print job TIMEOUT.`);
    }

    if (scenario === 'ERROR' || req.paperStatus === 'PAPER_OUT') {
      throw new Error(`[PRINTER_SIMULATOR] Printer error: PAPER_OUT_SENSOR_TRIGGERED.`);
    }

    const copies = req.copies || 1;
    const currentCount = this.printCounter.get(deviceId) || 0;
    this.printCounter.set(deviceId, currentCount + copies);

    const sku = req.tagData?.sku || 'BS-RNG-9948';
    const serial = req.tagData?.serialNo || 'SN-2026-00941';
    const zpl = `^XA^FO50,50^BQN,2,4^FDMM,${sku}^FS^FO150,50^A0N,25,25^FD${req.tagData?.titleAr || 'خاتم فضة 925'}^FS^XZ`;

    return {
      deviceId,
      jobId: `JOB-PRN-${Date.now()}`,
      status: 'COMPLETED',
      copiesPrinted: copies,
      paperStatus: req.paperStatus || 'PAPER_OK',
      dpiResolution: 600,
      simulatedZplCommands: zpl,
      timestamp: new Date()
    };
  }
}

// =============================================================================
// 3. BARCODE SCANNER SIMULATOR
// =============================================================================
export interface ScanTriggerRequest extends BaseSimulationRequest {
  barcodePayload?: string;
  barcodeFormat?: 'EAN13' | 'CODE128' | 'QR';
}

export interface ScanTriggerResponse {
  deviceId: string;
  barcodePayload: string;
  barcodeFormat: 'EAN13' | 'CODE128' | 'QR';
  scanDurationMs: number;
  timestamp: Date;
}

export class BarcodeScannerSimulator {
  static async triggerScan(deviceId: string, req: ScanTriggerRequest = {}): Promise<ScanTriggerResponse> {
    const scenario = req.scenario || 'SUCCESS';

    if (scenario === 'OFFLINE') {
      throw new Error(`[SCANNER_SIMULATOR] Scanner '${deviceId}' is OFFLINE.`);
    }

    if (scenario === 'TIMEOUT') {
      await new Promise(r => setTimeout(r, 4500));
      throw new Error(`[SCANNER_SIMULATOR] Scanner read TIMEOUT.`);
    }

    if (scenario === 'ERROR') {
      throw new Error(`[SCANNER_SIMULATOR] Unreadable barcode or laser decode error.`);
    }

    const barcodePayload = req.barcodePayload || 'SN-2026-00941';
    const barcodeFormat = req.barcodeFormat || 'CODE128';

    return {
      deviceId,
      barcodePayload,
      barcodeFormat,
      scanDurationMs: 45,
      timestamp: new Date()
    };
  }
}

// =============================================================================
// 4. CASH DRAWER SIMULATOR
// =============================================================================
export interface CashDrawerKickRequest extends BaseSimulationRequest {
  pulsePin?: number;
  pulseDurationMs?: number;
}

export interface CashDrawerKickResponse {
  deviceId: string;
  drawerState: 'OPEN' | 'CLOSED';
  pulsePin: number;
  pulseDurationMs: number;
  timestamp: Date;
}

export class CashDrawerSimulator {
  static async openDrawer(deviceId: string, req: CashDrawerKickRequest = {}): Promise<CashDrawerKickResponse> {
    const scenario = req.scenario || 'SUCCESS';

    if (scenario === 'OFFLINE') {
      throw new Error(`[CASH_DRAWER_SIMULATOR] Cash drawer solenoid interface '${deviceId}' is OFFLINE.`);
    }

    if (scenario === 'TIMEOUT') {
      await new Promise(r => setTimeout(r, 4500));
      throw new Error(`[CASH_DRAWER_SIMULATOR] Cash drawer kick pulse TIMEOUT.`);
    }

    if (scenario === 'ERROR') {
      throw new Error(`[CASH_DRAWER_SIMULATOR] Cash drawer sensor error: DRAWER_JAMMED.`);
    }

    return {
      deviceId,
      drawerState: 'OPEN',
      pulsePin: req.pulsePin || 2,
      pulseDurationMs: req.pulseDurationMs || 200,
      timestamp: new Date()
    };
  }
}

// =============================================================================
// 5. CUSTOMER DISPLAY SIMULATOR
// =============================================================================
export interface DisplayTextRequest extends BaseSimulationRequest {
  line1?: string;
  line2?: string;
  clearFirst?: boolean;
}

export interface DisplayTextResponse {
  deviceId: string;
  line1Content: string;
  line2Content: string;
  vfdBrightnessPct: number;
  timestamp: Date;
}

export class CustomerDisplaySimulator {
  static async displayText(deviceId: string, req: DisplayTextRequest = {}): Promise<DisplayTextResponse> {
    const scenario = req.scenario || 'SUCCESS';

    if (scenario === 'OFFLINE') {
      throw new Error(`[CUSTOMER_DISPLAY_SIMULATOR] Customer Display '${deviceId}' is OFFLINE.`);
    }

    if (scenario === 'TIMEOUT') {
      await new Promise(r => setTimeout(r, 4500));
      throw new Error(`[CUSTOMER_DISPLAY_SIMULATOR] Display update TIMEOUT.`);
    }

    if (scenario === 'ERROR') {
      throw new Error(`[CUSTOMER_DISPLAY_SIMULATOR] VFD controller buffer overflow error.`);
    }

    const line1Content = (req.line1 || 'BAHER SILVER FACTORY').slice(0, 20);
    const line2Content = (req.line2 || 'Total: 1,485.00 EGP').slice(0, 20);

    return {
      deviceId,
      line1Content,
      line2Content,
      vfdBrightnessPct: 100,
      timestamp: new Date()
    };
  }
}

// =============================================================================
// 6. CONNECTION TEST ENGINE
// =============================================================================
export interface ConnectionTestResult {
  deviceId: string;
  deviceCode: string;
  category: string;
  connectionType: string;
  status: 'SUCCESS' | 'FAILED';
  latencyMs: number;
  handshakeMessage: string;
  diagnostics: {
    driverBound: boolean;
    driverCode?: string;
    portOrIp: string;
    baudRateOrPort?: number;
  };
  timestamp: Date;
}

export class ConnectionTestEngine {
  static async executeHandshake(
    deviceId: string,
    deviceCode: string,
    category: string,
    connectionType: string,
    driverCode?: string,
    portOrIp: string = 'COM1',
    baudRate?: number,
    forceFail: boolean = false
  ): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    await new Promise(r => setTimeout(r, 120)); // Handshake simulation delay
    const latencyMs = Date.now() - startTime;

    if (forceFail) {
      return {
        deviceId,
        deviceCode,
        category,
        connectionType,
        status: 'FAILED',
        latencyMs,
        handshakeMessage: `Handshake failed for device '${deviceCode}' on port/IP '${portOrIp}': Device Unresponsive`,
        diagnostics: {
          driverBound: Boolean(driverCode),
          driverCode,
          portOrIp,
          baudRateOrPort: baudRate
        },
        timestamp: new Date()
      };
    }

    return {
      deviceId,
      deviceCode,
      category,
      connectionType,
      status: 'SUCCESS',
      latencyMs,
      handshakeMessage: `Handshake SUCCESSFUL for ${category} [${deviceCode}] via ${connectionType} (${portOrIp})`,
      diagnostics: {
        driverBound: Boolean(driverCode),
        driverCode,
        portOrIp,
        baudRateOrPort: baudRate
      },
      timestamp: new Date()
    };
  }
}
