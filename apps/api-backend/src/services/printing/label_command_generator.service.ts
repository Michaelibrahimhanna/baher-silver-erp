export interface LabelCommandPayload {
  barcodeValue: string;
  barcodeFormat?: string;
  svgRender?: string;
  serialNo?: string;
  sku?: string;
  titleAr?: string;
  weightGrams?: number;
  silverPurity?: string;
  price?: number;
  metalType?: string;
  includeQrCode?: boolean;
  qrPayload?: string;
  widthMm?: number;
  heightMm?: number;
  dpi?: 203 | 300 | 600;
  copies?: number;
  labelType?: 'MOUSE_TAIL' | 'RECTANGLE_TAG' | 'BUTTERFLY_TAG';
  margins?: { top?: number; bottom?: number; left?: number; right?: number };
  offsets?: { x?: number; y?: number };
  elements?: Array<{
    id: string;
    type: 'barcode' | 'qrcode' | 'text' | 'line';
    field?: string;
    text?: string;
    xMm: number;
    yMm: number;
    widthMm?: number;
    heightMm?: number;
    fontSizePt?: number;
  }>;
}

export class ZPLGenerator {
  static generate(payload: LabelCommandPayload): string {
    const dpi = payload.dpi || 600;
    const dmm = dpi / 25.4; // dots per mm (e.g. 203dpi = 8, 300dpi = 11.81, 600dpi = 23.62)
    const widthDots = Math.round((payload.widthMm || 50) * dmm);
    const heightDots = Math.round((payload.heightMm || 15) * dmm);

    const offsetX = Math.round((payload.offsets?.x || 0) * dmm);
    const offsetY = Math.round((payload.offsets?.y || 0) * dmm);

    const marginTop = Math.round((payload.margins?.top || 1) * dmm);
    const marginLeft = Math.round((payload.margins?.left || 1) * dmm);

    const copies = payload.copies || 1;
    const barcode = payload.barcodeValue || 'SN-2026-000001';
    const serial = payload.serialNo || barcode;
    const sku = payload.sku || 'SKU-001';
    const title = payload.titleAr || 'خاتم فضة 925';
    const weight = payload.weightGrams ? `${payload.weightGrams}g` : '0g';
    const purity = payload.silverPurity || '925';
    const priceStr = payload.price ? `${payload.price} EGP` : '';
    const metalStr = payload.metalType || 'فضة 925';

    const zplLines: string[] = [
      `^XA`,
      `^PW${widthDots}`,
      `^LL${heightDots}`,
      `^LH${marginLeft + offsetX},${marginTop + offsetY}`,
      `^PON`
    ];

    if (payload.elements && payload.elements.length > 0) {
      // Dynamic Visual Designer Element Placement
      for (const el of payload.elements) {
        const posX = Math.round(el.xMm * dmm);
        const posY = Math.round(el.yMm * dmm);
        const fontH = Math.round((el.fontSizePt || 8) * (dpi / 72));

        if (el.type === 'barcode') {
          const barHeight = Math.round((el.heightMm || 6) * dmm);
          zplLines.push(`^FO${posX},${posY}^BY2,3,${barHeight}^BCN,N,N,N^FD${barcode}^FS`);
        } else if (el.type === 'qrcode' || (el.type === 'text' && el.field === 'qr')) {
          const qrPayload = payload.qrPayload || barcode;
          zplLines.push(`^FO${posX},${posY}^BQN,2,4^FDMM,${qrPayload}^FS`);
        } else if (el.type === 'text') {
          let val = el.text || '';
          if (el.field === 'name') val = title;
          else if (el.field === 'sku') val = sku;
          else if (el.field === 'serial') val = serial;
          else if (el.field === 'weight') val = weight;
          else if (el.field === 'price') val = priceStr;
          else if (el.field === 'metalType') val = metalStr;
          else if (el.field === 'barcodeText') val = barcode;

          zplLines.push(`^FO${posX},${posY}^A0N,${fontH},${fontH}^FD${val}^FS`);
        } else if (el.type === 'line') {
          const lineW = Math.round((el.widthMm || 10) * dmm);
          const lineH = Math.round((el.heightMm || 0.5) * dmm);
          zplLines.push(`^FO${posX},${posY}^GB${lineW},${lineH},1^FS`);
        }
      }
    } else {
      // Automatic Centered Tail Label Layout
      const fontH1 = Math.round(2.2 * dmm);
      const fontH2 = Math.round(1.8 * dmm);
      const barH = Math.round(5.0 * dmm);

      zplLines.push(`^FO${Math.round(2 * dmm)},${Math.round(1 * dmm)}^A0N,${fontH1},${fontH1}^FD${title}^FS`);
      zplLines.push(`^FO${Math.round(2 * dmm)},${Math.round(3.5 * dmm)}^BY2,3,${barH}^BCN,N,N,N^FD${barcode}^FS`);
      zplLines.push(`^FO${Math.round(2 * dmm)},${Math.round(9 * dmm)}^A0N,${fontH2},${fontH2}^FD${serial} | ${sku}^FS`);
      zplLines.push(`^FO${Math.round(2 * dmm)},${Math.round(11 * dmm)}^A0N,${fontH2},${fontH2}^FD${weight} | ${metalStr} | ${priceStr}^FS`);

      if (payload.includeQrCode) {
        const qrX = Math.round((payload.widthMm || 50) * dmm - 12 * dmm);
        const qrPayload = payload.qrPayload || `https://bahersilver.com/v/${serial}`;
        zplLines.push(`^FO${qrX},${Math.round(2 * dmm)}^BQN,2,3^FDMM,${qrPayload}^FS`);
      }
    }

    zplLines.push(`^PQ${copies}`);
    zplLines.push(`^XZ`);

    return zplLines.join('\n');
  }
}

export class EPLGenerator {
  static generate(payload: LabelCommandPayload): string {
    const dpi = payload.dpi || 203;
    const dmm = dpi / 25.4;
    const widthDots = Math.round((payload.widthMm || 30) * dmm);
    const heightDots = Math.round((payload.heightMm || 15) * dmm);

    const copies = payload.copies || 1;
    const barcode = payload.barcodeValue || 'SN-2026-000001';
    const serial = payload.serialNo || barcode;
    const weight = payload.weightGrams ? `${payload.weightGrams}g` : '';

    return [
      `N`,
      `q${widthDots}`,
      `Q${heightDots},24`,
      `B20,15,0,1,2,5,35,B,"${barcode}"`,
      `A20,55,0,2,1,1,N,"${serial} ${weight}"`,
      `P${copies}`,
      ``
    ].join('\n');
  }
}

export class TSPLGenerator {
  static generate(payload: LabelCommandPayload): string {
    const widthMm = payload.widthMm || 50;
    const heightMm = payload.heightMm || 15;
    const copies = payload.copies || 1;
    const barcode = payload.barcodeValue || 'SN-2026-000001';
    const serial = payload.serialNo || barcode;
    const title = payload.titleAr || 'خاتم فضة 925';

    return [
      `SIZE ${widthMm} mm, ${heightMm} mm`,
      `SPEED 4`,
      `DENSITY 8`,
      `GAP 2 mm, 0 mm`,
      `DIRECTION 1`,
      `CLS`,
      `TEXT 20,20,"3",0,1,1,"${title}"`,
      `BARCODE 20,45,"128",40,1,0,2,2,"${barcode}"`,
      `TEXT 20,90,"2",0,1,1,"${serial}"`,
      `PRINT ${copies},1`,
      ``
    ].join('\n');
  }
}

export class EZPLGenerator {
  static generate(payload: LabelCommandPayload): string {
    const heightMm = payload.heightMm || 15;
    const widthMm = payload.widthMm || 50;
    const copies = payload.copies || 1;
    const barcode = payload.barcodeValue || 'SN-2026-000001';
    const serial = payload.serialNo || barcode;

    return [
      `^Q${heightMm},0,0`,
      `^W${widthMm}`,
      `^H8`,
      `^P${copies}`,
      `^S4`,
      `^L`,
      `B 20 20 0 1 2 4 40 0 "${barcode}"`,
      `A 20 70 0 2 1 1 0 "${serial}"`,
      `E`,
      ``
    ].join('\n');
  }
}

export class PDFVectorGenerator {
  static generate(payload: LabelCommandPayload): string {
    const widthMm = payload.widthMm || 50;
    const heightMm = payload.heightMm || 15;
    const barcodeSvg = payload.svgRender || `<svg><text>Barcode: ${payload.barcodeValue}</text></svg>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${widthMm}mm" height="${heightMm}mm" viewBox="0 0 ${widthMm * 10} ${heightMm * 10}" style="background:#ffffff;">
  <style>
    .title { font-family: 'Tajawal', sans-serif; font-weight: bold; font-size: 10px; fill: #000000; }
    .meta { font-family: monospace; font-size: 8px; fill: #333333; }
  </style>
  <rect x="0" y="0" width="${widthMm * 10}" height="${heightMm * 10}" fill="none" stroke="#e2e8f0" stroke-width="1"/>
  <text x="5" y="12" class="title">${payload.titleAr || 'خاتم فضة 925'}</text>
  <g transform="translate(5, 16)">
    ${barcodeSvg}
  </g>
  <text x="5" y="${heightMm * 10 - 5}" class="meta">${payload.serialNo || payload.barcodeValue} | ${payload.weightGrams ? payload.weightGrams + 'g' : ''} | ${payload.price ? payload.price + ' EGP' : ''}</text>
</svg>`;
  }
}

