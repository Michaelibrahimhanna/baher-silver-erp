/**
 * EPIC 03 SPRINT 01: BARCODE & LABEL PLATFORM ENGINE
 * Abstracted, format-independent Barcode Generation, Validation & Rendering Engine.
 * Supports Code128, EAN13, and GS1-128 with Application Identifiers (AI).
 */

export type BarcodeFormat = 'CODE128' | 'EAN13' | 'GS1_128';

export interface BarcodeValidationResult {
  isValid: boolean;
  format: BarcodeFormat;
  code: string;
  checkDigit?: string;
  errorMessage?: string;
  parsedAIs?: Record<string, string>; // For GS1
}

export interface BarcodeRenderOptions {
  width?: number;
  height?: number;
  showText?: boolean;
  barWidth?: number;
}

export interface IBarcodeStrategy {
  format: BarcodeFormat;
  generatePayload(data: any): string;
  validate(code: string): BarcodeValidationResult;
  renderSVG(code: string, opts?: BarcodeRenderOptions): string;
  renderASCII(code: string): string;
}

// =============================================================================
// 1. CODE128 STRATEGY
// =============================================================================
export class Code128Strategy implements IBarcodeStrategy {
  readonly format: BarcodeFormat = 'CODE128';

  generatePayload(data: any): string {
    if (typeof data === 'string') return data.trim();
    if (data?.sku) return String(data.sku).trim();
    if (data?.serialNo) return String(data.serialNo).trim();
    throw new Error('Code128 payload generation requires a string, SKU, or Serial Number.');
  }

  validate(code: string): BarcodeValidationResult {
    if (!code || typeof code !== 'string') {
      return { isValid: false, format: this.format, code, errorMessage: 'Empty code' };
    }
    const sanitized = code.trim();
    // Code128 allows ASCII 0 to 127
    const isAscii = /^[\x00-\x7F]+$/.test(sanitized);
    if (!isAscii) {
      return { isValid: false, format: this.format, code: sanitized, errorMessage: 'Code128 code contains non-ASCII characters' };
    }

    const checkSumDigit = this.calculateModulo103CheckDigit(sanitized);
    return {
      isValid: true,
      format: this.format,
      code: sanitized,
      checkDigit: String(checkSumDigit)
    };
  }

  private calculateModulo103CheckDigit(code: string): number {
    let sum = 104; // Start Code B (default)
    for (let i = 0; i < code.length; i++) {
      const asciiVal = code.charCodeAt(i) - 32;
      sum += asciiVal * (i + 1);
    }
    return sum % 103;
  }

  renderSVG(code: string, opts: BarcodeRenderOptions = {}): string {
    const height = opts.height || 60;
    const width = opts.width || 240;
    const showText = opts.showText !== false;

    // Abstract vector bar generator
    const bars: string[] = [];
    let x = 10;
    const barW = opts.barWidth || 2;

    // Simulate Code128 start, data, check, stop bars pattern
    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i);
      const pattern = (charCode % 2 === 0) ? [barW, barW * 2, barW] : [barW * 2, barW, barW * 2];
      pattern.forEach((w, idx) => {
        if (idx % 2 === 0) {
          bars.push(`<rect x="${x}" y="10" width="${w}" height="${height - 25}" fill="#000000"/>`);
        }
        x += w;
      });
    }

    const textSvg = showText 
      ? `<text x="${width / 2}" y="${height - 4}" font-family="monospace" font-size="12" text-anchor="middle" fill="#000000">${code}</text>` 
      : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.max(width, x + 10)} ${height}" width="${Math.max(width, x + 10)}" height="${height}" style="background:#ffffff;">
      <g>
        ${bars.join('\n        ')}
      </g>
      ${textSvg}
    </svg>`;
  }

  renderASCII(code: string): string {
    return `|||| | | |||| | ||| | ||| [Code128: ${code}]`;
  }
}

// =============================================================================
// 2. EAN13 STRATEGY (European Article Number 13)
// =============================================================================
export class EAN13Strategy implements IBarcodeStrategy {
  readonly format: BarcodeFormat = 'EAN13';

  generatePayload(data: any): string {
    if (typeof data === 'string' && data.length === 12) {
      return data + this.calculateEAN13CheckDigit(data);
    }
    if (typeof data === 'string' && data.length === 13) {
      return data;
    }
    if (data?.numericCode && String(data.numericCode).length >= 12) {
      const base12 = String(data.numericCode).padStart(12, '0').slice(0, 12);
      return base12 + this.calculateEAN13CheckDigit(base12);
    }
    // Generate default EAN13 for Baher Silver (Country 622 = Egypt)
    const randomSeq = Math.floor(100000000 + Math.random() * 900000000).toString();
    const base12 = `622${randomSeq}`;
    return base12 + this.calculateEAN13CheckDigit(base12);
  }

  validate(code: string): BarcodeValidationResult {
    if (!code || typeof code !== 'string') {
      return { isValid: false, format: this.format, code, errorMessage: 'Empty EAN13 code' };
    }
    const clean = code.trim();
    if (!/^\d{13}$/.test(clean)) {
      return { isValid: false, format: this.format, code: clean, errorMessage: 'EAN13 must contain exactly 13 numeric digits' };
    }

    const base12 = clean.slice(0, 12);
    const expectedCheck = this.calculateEAN13CheckDigit(base12);
    const actualCheck = clean.slice(12);

    if (expectedCheck !== actualCheck) {
      return {
        isValid: false,
        format: this.format,
        code: clean,
        checkDigit: expectedCheck,
        errorMessage: `Invalid EAN13 Modulo 10 check digit. Expected '${expectedCheck}', got '${actualCheck}'.`
      };
    }

    return {
      isValid: true,
      format: this.format,
      code: clean,
      checkDigit: expectedCheck
    };
  }

  private calculateEAN13CheckDigit(base12: string): string {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(base12[i], 10);
      sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const remainder = sum % 10;
    return remainder === 0 ? '0' : String(10 - remainder);
  }

  renderSVG(code: string, opts: BarcodeRenderOptions = {}): string {
    const height = opts.height || 65;
    const width = opts.width || 200;
    const showText = opts.showText !== false;

    const bars: string[] = [];
    let x = 15;

    for (let i = 0; i < code.length; i++) {
      const w = (i === 0 || i === 6 || i === 12) ? 3 : 2;
      bars.push(`<rect x="${x}" y="10" width="${w}" height="${height - 25}" fill="#000000"/>`);
      x += w + 2;
    }

    const textSvg = showText 
      ? `<text x="${width / 2}" y="${height - 4}" font-family="monospace" font-weight="bold" font-size="12" text-anchor="middle" fill="#000000">${code}</text>` 
      : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background:#ffffff;">
      <g>
        ${bars.join('\n        ')}
      </g>
      ${textSvg}
    </svg>`;
  }

  renderASCII(code: string): string {
    return `|||| | || |||| | | [EAN13: ${code}]`;
  }
}

// =============================================================================
// 3. GS1-128 STRATEGY (Application Identifiers for GTIN, Serial, Weight, Date)
// =============================================================================
export class GS1128Strategy implements IBarcodeStrategy {
  readonly format: BarcodeFormat = 'GS1_128';

  generatePayload(data: any): string {
    // AIs: (01) GTIN/SKU, (21) Serial, (3102) Net Weight grams (6 digits), (11) Prod Date (YYMMDD)
    const ais: string[] = [];

    if (data.sku) {
      const gtin = String(data.sku).replace(/[^0-9]/g, '').padStart(14, '0').slice(-14);
      ais.push(`(01)${gtin}`);
    } else {
      ais.push(`(01)06229994800014`);
    }

    if (data.serialNo) {
      ais.push(`(21)${data.serialNo}`);
    }

    if (data.weightGrams !== undefined) {
      // AI 3102: Net weight in grams (6 digits e.g. 001485 = 14.85g)
      const weightInt = Math.round(Number(data.weightGrams) * 100);
      const weightStr = String(weightInt).padStart(6, '0').slice(-6);
      ais.push(`(3102)${weightStr}`);
    }

    if (data.productionDate) {
      const dateObj = new Date(data.productionDate);
      const yy = String(dateObj.getFullYear()).slice(-2);
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      ais.push(`(11)${yy}${mm}${dd}`);
    }

    return ais.join('');
  }

  validate(code: string): BarcodeValidationResult {
    if (!code || typeof code !== 'string') {
      return { isValid: false, format: this.format, code, errorMessage: 'Empty GS1-128 code' };
    }
    const clean = code.trim();

    // Parse Application Identifiers e.g. (01)06229994800014(21)SN-102(3102)001485
    const aiRegex = /\((\d{2,4})\)([^\(\)]+)/g;
    const parsedAIs: Record<string, string> = {};
    let match;

    while ((match = aiRegex.exec(clean)) !== null) {
      parsedAIs[match[1]] = match[2];
    }

    if (Object.keys(parsedAIs).length === 0) {
      return {
        isValid: false,
        format: this.format,
        code: clean,
        errorMessage: 'Invalid GS1-128 formatting: No Application Identifiers (AIs) found. Use (01), (21), (3102), etc.'
      };
    }

    return {
      isValid: true,
      format: this.format,
      code: clean,
      parsedAIs
    };
  }

  renderSVG(code: string, opts: BarcodeRenderOptions = {}): string {
    const height = opts.height || 70;
    const width = opts.width || 320;
    const showText = opts.showText !== false;

    const bars: string[] = [];
    let x = 15;

    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i);
      const w = (charCode % 3 === 0) ? 3 : 2;
      bars.push(`<rect x="${x}" y="10" width="${w}" height="${height - 25}" fill="#000000"/>`);
      x += w + 2;
    }

    const textSvg = showText 
      ? `<text x="${width / 2}" y="${height - 4}" font-family="monospace" font-size="11" text-anchor="middle" fill="#000000">${code}</text>` 
      : '';

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.max(width, x + 10)} ${height}" width="${Math.max(width, x + 10)}" height="${height}" style="background:#ffffff;">
      <g>
        ${bars.join('\n        ')}
      </g>
      ${textSvg}
    </svg>`;
  }

  renderASCII(code: string): string {
    return `|| |||| | | |||| | ||| [GS1-128: ${code}]`;
  }
}

// =============================================================================
// 4. BARCODE ENGINE FACTORY
// =============================================================================
export class BarcodeEngineFactory {
  private static strategies: Map<BarcodeFormat, IBarcodeStrategy> = new Map([
    ['CODE128', new Code128Strategy()],
    ['EAN13', new EAN13Strategy()],
    ['GS1_128', new GS1128Strategy()]
  ]);

  static getStrategy(format: BarcodeFormat): IBarcodeStrategy {
    const strategy = this.strategies.get(format);
    if (!strategy) {
      throw new Error(`Unsupported barcode format '${format}'. Available: CODE128, EAN13, GS1_128.`);
    }
    return strategy;
  }

  static registerStrategy(strategy: IBarcodeStrategy) {
    this.strategies.set(strategy.format, strategy);
  }
}
