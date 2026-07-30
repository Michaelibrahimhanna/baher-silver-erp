export interface ScaleFrameResult {
  grossWeightGrams: number;
  tareWeightGrams: number;
  netWeightGrams: number;
  unit: string;
  isStable: boolean;
  rawFrame: string;
}

export interface IScaleDriver {
  protocol: 'RS232' | 'USB_SERIAL' | 'USB_HID' | 'WEBSERIAL';
  connect(portName?: string, baudRate?: number): Promise<boolean>;
  disconnect(): Promise<boolean>;
  parseFrame(rawInput: string | Buffer | Uint8Array): ScaleFrameResult;
  zero(): Promise<boolean>;
  tare(tareWeightGrams?: number): Promise<boolean>;
}

export class RS232ScaleDriver implements IScaleDriver {
  protocol: 'RS232' = 'RS232';
  private currentTare = 0;

  async connect(): Promise<boolean> { return true; }
  async disconnect(): Promise<boolean> { return true; }

  parseFrame(rawInput: string | Buffer): ScaleFrameResult {
    const str = rawInput.toString().trim();
    // Typical RS232 Scale String: "ST,GS,+0004.85g" or "US,GS,+0004.85g"
    const isStable = str.startsWith('ST') || !str.startsWith('US');
    const match = str.match(/([+-]?\d+\.?\d*)\s*(g|ct|kg)?/i);
    const gross = match ? Math.abs(parseFloat(match[1])) : 0;
    const net = Math.max(0, parseFloat((gross - this.currentTare).toFixed(3)));

    return {
      grossWeightGrams: gross,
      tareWeightGrams: this.currentTare,
      netWeightGrams: net,
      unit: 'g',
      isStable,
      rawFrame: str
    };
  }

  async zero(): Promise<boolean> {
    this.currentTare = 0;
    return true;
  }

  async tare(tareWeightGrams: number = 0): Promise<boolean> {
    this.currentTare = tareWeightGrams;
    return true;
  }
}

export class USBSerialScaleDriver implements IScaleDriver {
  protocol: 'USB_SERIAL' = 'USB_SERIAL';
  private currentTare = 0;

  async connect(): Promise<boolean> { return true; }
  async disconnect(): Promise<boolean> { return true; }

  parseFrame(rawInput: string | Buffer): ScaleFrameResult {
    const str = rawInput.toString().trim();
    const match = str.match(/([+-]?\d+\.?\d*)/);
    const gross = match ? Math.abs(parseFloat(match[1])) : 0;
    const net = Math.max(0, parseFloat((gross - this.currentTare).toFixed(3)));

    return {
      grossWeightGrams: gross,
      tareWeightGrams: this.currentTare,
      netWeightGrams: net,
      unit: 'g',
      isStable: true,
      rawFrame: str
    };
  }

  async zero(): Promise<boolean> { this.currentTare = 0; return true; }
  async tare(tareWeightGrams: number = 0): Promise<boolean> { this.currentTare = tareWeightGrams; return true; }
}

export class USBHIDScaleDriver implements IScaleDriver {
  protocol: 'USB_HID' = 'USB_HID';
  private currentTare = 0;

  async connect(): Promise<boolean> { return true; }
  async disconnect(): Promise<boolean> { return true; }

  parseFrame(rawInput: string | Buffer | Uint8Array): ScaleFrameResult {
    // USB HID Scale Report Parser (6-byte / 8-byte report)
    // Byte 0: Report ID, Byte 1: Status (2=Zero, 4=Stable, 5=Unstable), Byte 2: Unit (2=g), Byte 4-5: Weight LSB/MSB
    let gross = 0;
    let isStable = true;

    if (Buffer.isBuffer(rawInput) && rawInput.length >= 6) {
      isStable = rawInput[1] === 4;
      const rawVal = rawInput[4] + (rawInput[5] << 8);
      const scaling = rawInput[3] === 255 ? 0.1 : 0.01;
      gross = parseFloat((rawVal * scaling).toFixed(3));
    } else {
      const str = rawInput.toString().trim();
      const match = str.match(/([+-]?\d+\.?\d*)/);
      gross = match ? Math.abs(parseFloat(match[1])) : 0;
    }

    const net = Math.max(0, parseFloat((gross - this.currentTare).toFixed(3)));

    return {
      grossWeightGrams: gross,
      tareWeightGrams: this.currentTare,
      netWeightGrams: net,
      unit: 'g',
      isStable,
      rawFrame: typeof rawInput === 'string' ? rawInput : rawInput.toString('hex')
    };
  }

  async zero(): Promise<boolean> { this.currentTare = 0; return true; }
  async tare(tareWeightGrams: number = 0): Promise<boolean> { this.currentTare = tareWeightGrams; return true; }
}

export class WebSerialScaleDriver implements IScaleDriver {
  protocol: 'WEBSERIAL' = 'WEBSERIAL';
  private currentTare = 0;

  async connect(): Promise<boolean> { return true; }
  async disconnect(): Promise<boolean> { return true; }

  parseFrame(rawInput: string | Buffer): ScaleFrameResult {
    const str = rawInput.toString().trim();
    const match = str.match(/([+-]?\d+\.?\d*)/);
    const gross = match ? Math.abs(parseFloat(match[1])) : 0;
    const net = Math.max(0, parseFloat((gross - this.currentTare).toFixed(3)));

    return {
      grossWeightGrams: gross,
      tareWeightGrams: this.currentTare,
      netWeightGrams: net,
      unit: 'g',
      isStable: !str.includes('US'),
      rawFrame: str
    };
  }

  async zero(): Promise<boolean> { this.currentTare = 0; return true; }
  async tare(tareWeightGrams: number = 0): Promise<boolean> { this.currentTare = tareWeightGrams; return true; }
}

export class ScaleDriverFactory {
  static getDriver(protocol: string): IScaleDriver {
    switch (protocol.toUpperCase()) {
      case 'RS232':
        return new RS232ScaleDriver();
      case 'USB_SERIAL':
        return new USBSerialScaleDriver();
      case 'USB_HID':
        return new USBHIDScaleDriver();
      case 'WEBSERIAL':
        return new WebSerialScaleDriver();
      default:
        return new RS232ScaleDriver();
    }
  }
}
