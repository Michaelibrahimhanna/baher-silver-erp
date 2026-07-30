import { PrismaClient } from '@prisma/client';
import {
  BarcodeEngineFactory,
  BarcodeFormat,
  BarcodeRenderOptions
} from './barcode/barcode_engine.service';

const prisma = new PrismaClient();

export interface CreateLabelTemplateDTO {
  templateCode: string;
  name: string;
  category?: 'JEWELRY_TAG' | 'PRODUCT_BOX' | 'PALLET_LABEL' | 'RAW_MATERIAL';
  widthMm?: number;
  heightMm?: number;
  dpi?: number;
  defaultBarcodeFormat?: BarcodeFormat;
  layoutJson: string | object;
  isDefault?: boolean;
}

export class BarcodeLabelService {
  // =============================================================================
  // 1. BARCODE GENERATION, VALIDATION & RENDERING SERVICE
  // =============================================================================

  static generateBarcode(format: BarcodeFormat, data: any, operatorName: string = 'SYSTEM') {
    const strategy = BarcodeEngineFactory.getStrategy(format);
    const rawPayload = strategy.generatePayload(data);
    const validation = strategy.validate(rawPayload);

    if (!validation.isValid) {
      throw new Error(`Barcode generation failed for format '${format}': ${validation.errorMessage}`);
    }

    const svg = strategy.renderSVG(rawPayload);
    const ascii = strategy.renderASCII(rawPayload);
    const base64DataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

    // Record audit log asynchronously
    prisma.barcodeGenerationAudit.create({
      data: {
        barcodeValue: rawPayload,
        format,
        entityType: data?.entityType || null,
        entityId: data?.entityId || null,
        sku: data?.sku || null,
        serialNo: data?.serialNo || null,
        gs1PayloadJson: validation.parsedAIs ? JSON.stringify(validation.parsedAIs) : null,
        generatedBy: operatorName
      }
    }).catch(e => console.error('Error logging barcode audit:', e));

    return {
      format,
      code: rawPayload,
      isValid: validation.isValid,
      checkDigit: validation.checkDigit,
      parsedAIs: validation.parsedAIs,
      render: {
        svg,
        base64DataUri,
        ascii
      }
    };
  }

  static validateBarcode(format: BarcodeFormat, code: string) {
    const strategy = BarcodeEngineFactory.getStrategy(format);
    return strategy.validate(code);
  }

  static renderBarcode(format: BarcodeFormat, code: string, opts?: BarcodeRenderOptions) {
    const strategy = BarcodeEngineFactory.getStrategy(format);
    const validation = strategy.validate(code);

    if (!validation.isValid) {
      throw new Error(`Cannot render invalid barcode '${code}': ${validation.errorMessage}`);
    }

    const svg = strategy.renderSVG(code, opts);
    const ascii = strategy.renderASCII(code);
    const base64DataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

    return {
      format,
      code,
      svg,
      base64DataUri,
      ascii
    };
  }

  // =============================================================================
  // 2. PRODUCT IDENTITY PLATFORM INTEGRATION (EPIC 02)
  // =============================================================================

  static async generateBarcodeForPiece(pieceIdOrSerial: string, format: BarcodeFormat = 'CODE128', operatorName: string = 'SYSTEM') {
    const piece = await prisma.physicalPiece.findFirst({
      where: {
        OR: [{ id: pieceIdOrSerial }, { serialNo: pieceIdOrSerial }]
      },
      include: {
        productModel: true,
        variant: true
      }
    });

    if (!piece) {
      throw new Error(`Physical piece not found for '${pieceIdOrSerial}'`);
    }

    const barcodeInputData = {
      entityType: 'PHYSICAL_PIECE',
      entityId: piece.id,
      sku: piece.sku,
      serialNo: piece.serialNo,
      weightGrams: piece.weightGrams,
      silverPurity: piece.silverPurity,
      verificationToken: piece.verificationToken,
      titleAr: piece.productModel.nameAr
    };

    const barcodeResult = this.generateBarcode(format, barcodeInputData, operatorName);

    return {
      pieceId: piece.id,
      serialNo: piece.serialNo,
      sku: piece.sku,
      productNameAr: piece.productModel.nameAr,
      weightGrams: piece.weightGrams,
      silverPurity: piece.silverPurity,
      barcode: barcodeResult
    };
  }

  static async generateBarcodeForProduct(productIdOrCode: string, format: BarcodeFormat = 'EAN13', operatorName: string = 'SYSTEM') {
    const product = await prisma.productMaster.findFirst({
      where: {
        OR: [{ id: productIdOrCode }, { productCode: productIdOrCode }]
      }
    });

    if (!product) {
      throw new Error(`Product model not found for '${productIdOrCode}'`);
    }

    const barcodeInputData = {
      entityType: 'PRODUCT_MASTER',
      entityId: product.id,
      sku: product.productCode,
      numericCode: product.productCode.replace(/[^0-9]/g, '')
    };

    const barcodeResult = this.generateBarcode(format, barcodeInputData, operatorName);

    return {
      productId: product.id,
      productCode: product.productCode,
      nameAr: product.nameAr,
      category: product.category,
      barcode: barcodeResult
    };
  }

  // =============================================================================
  // 3. PRINTABLE LABEL MODEL & TEMPLATES
  // =============================================================================

  static async createLabelTemplate(data: CreateLabelTemplateDTO) {
    const existing = await prisma.printableLabelTemplate.findUnique({
      where: { templateCode: data.templateCode }
    });
    if (existing) {
      throw new Error(`Label template code '${data.templateCode}' already exists.`);
    }

    const layoutStr = typeof data.layoutJson === 'object' 
      ? JSON.stringify(data.layoutJson) 
      : data.layoutJson;

    if (data.isDefault) {
      await prisma.printableLabelTemplate.updateMany({
        where: { category: data.category || 'JEWELRY_TAG' },
        data: { isDefault: false }
      });
    }

    return await prisma.printableLabelTemplate.create({
      data: {
        templateCode: data.templateCode,
        name: data.name,
        category: data.category || 'JEWELRY_TAG',
        widthMm: data.widthMm || 30.0,
        heightMm: data.heightMm || 15.0,
        dpi: data.dpi || 600,
        defaultBarcodeFormat: data.defaultBarcodeFormat || 'CODE128',
        layoutJson: layoutStr,
        isDefault: data.isDefault || false
      }
    });
  }

  static async listLabelTemplates(category?: string) {
    return await prisma.printableLabelTemplate.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getLabelTemplateById(idOrCode: string) {
    const template = await prisma.printableLabelTemplate.findFirst({
      where: {
        OR: [{ id: idOrCode }, { templateCode: idOrCode }]
      }
    });
    if (!template) throw new Error(`Printable label template not found for '${idOrCode}'`);
    return template;
  }

  static async deleteLabelTemplate(idOrCode: string) {
    const template = await this.getLabelTemplateById(idOrCode);
    return await prisma.printableLabelTemplate.delete({
      where: { id: template.id }
    });
  }

  static async duplicateLabelTemplate(idOrCode: string, newCode?: string, newName?: string) {
    const source = await this.getLabelTemplateById(idOrCode);
    const targetCode = newCode || `${source.templateCode}-COPY-${Date.now().toString().slice(-4)}`;
    const targetName = newName || `${source.name} (نسخة)`;

    return await this.createLabelTemplate({
      templateCode: targetCode,
      name: targetName,
      category: source.category as any,
      widthMm: source.widthMm,
      heightMm: source.heightMm,
      dpi: source.dpi,
      defaultBarcodeFormat: source.defaultBarcodeFormat as any,
      layoutJson: source.layoutJson,
      isDefault: false
    });
  }

  static async renderLabelPreview(templateIdOrCode: string, pieceIdOrSerial: string) {
    const template = await this.getLabelTemplateById(templateIdOrCode);
    const pieceBarcodeData = await this.generateBarcodeForPiece(
      pieceIdOrSerial,
      template.defaultBarcodeFormat as BarcodeFormat
    );

    const layout = JSON.parse(template.layoutJson || '{}');

    return {
      template: {
        id: template.id,
        templateCode: template.templateCode,
        name: template.name,
        widthMm: template.widthMm,
        heightMm: template.heightMm,
        dpi: template.dpi
      },
      piece: {
        serialNo: pieceBarcodeData.serialNo,
        sku: pieceBarcodeData.sku,
        productNameAr: pieceBarcodeData.productNameAr,
        weightGrams: pieceBarcodeData.weightGrams,
        silverPurity: pieceBarcodeData.silverPurity
      },
      barcode: pieceBarcodeData.barcode,
      layout
    };
  }

  static async listGenerationAudits(filters?: { barcodeValue?: string; format?: string }) {
    const where: any = {};
    if (filters?.barcodeValue) where.barcodeValue = { contains: filters.barcodeValue };
    if (filters?.format) where.format = filters.format;

    return await prisma.barcodeGenerationAudit.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  // =============================================================================
  // SPRINT 03: TEMPLATE VERSIONING & IMPORT / EXPORT
  // =============================================================================

  static async createTemplateVersion(idOrCode: string, changelog?: string, createdBy: string = 'SYSTEM') {
    const template = await this.getLabelTemplateById(idOrCode);
    const nextVersionNo = template.versionNo + 1;
    const nextVersion = `1.${nextVersionNo - 1}.0`;

    // Save snapshot in version history
    const versionRecord = await prisma.labelTemplateVersion.create({
      data: {
        templateId: template.id,
        versionNo: nextVersionNo,
        version: nextVersion,
        layoutJson: template.layoutJson,
        changelog: changelog || `Version ${nextVersion} auto snapshot`,
        createdBy
      }
    });

    // Update main template record version
    const updatedTemplate = await prisma.printableLabelTemplate.update({
      where: { id: template.id },
      data: {
        versionNo: nextVersionNo,
        version: nextVersion,
        changelog: changelog || undefined
      }
    });

    return {
      template: updatedTemplate,
      version: versionRecord
    };
  }

  static async listTemplateVersions(idOrCode: string) {
    const template = await this.getLabelTemplateById(idOrCode);
    return await prisma.labelTemplateVersion.findMany({
      where: { templateId: template.id },
      orderBy: { versionNo: 'desc' }
    });
  }

  static async exportTemplateJson(idOrCode: string) {
    const template = await this.getLabelTemplateById(idOrCode);
    const layout = JSON.parse(template.layoutJson || '{}');

    return {
      schemaVersion: 'EPIC03-SPRINT03-V1',
      exportedAt: new Date().toISOString(),
      template: {
        templateCode: template.templateCode,
        name: template.name,
        category: template.category,
        widthMm: template.widthMm,
        heightMm: template.heightMm,
        dpi: template.dpi,
        defaultBarcodeFormat: template.defaultBarcodeFormat,
        version: template.version,
        versionNo: template.versionNo,
        layout
      }
    };
  }

  static async importTemplateJson(importData: any) {
    const payload = typeof importData === 'string' ? JSON.parse(importData) : importData;
    const t = payload.template || payload;

    if (!t.templateCode || !t.name) {
      throw new Error('Invalid template import package: templateCode and name are required.');
    }

    const templateCode = `${t.templateCode}-IMP-${Date.now().toString().slice(-4)}`;
    const layoutJsonStr = typeof t.layout === 'object' ? JSON.stringify(t.layout) : (t.layoutJson || '{}');

    return await this.createLabelTemplate({
      templateCode,
      name: `${t.name} (مستورد)`,
      category: t.category || 'JEWELRY_TAG',
      widthMm: t.widthMm || 50.0,
      heightMm: t.heightMm || 15.0,
      dpi: t.dpi || 600,
      defaultBarcodeFormat: t.defaultBarcodeFormat || 'CODE128',
      layoutJson: layoutJsonStr,
      isDefault: false
    });
  }
}

