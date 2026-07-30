import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

export interface UploadAssetInput {
  productId?: string;
  assetName: string;
  fileUrl: string;
  previewUrl?: string;
  model3dUrl?: string;
  fileType: 'CAD_STL' | 'CAD_3DM' | 'CAD_DXF' | 'PDF' | 'IMAGE' | 'PRODUCTION_DOC';
  fileSizeBytes?: number;
  designerName?: string;
  tags?: string[];
  dependencies?: Record<string, string>;
  lifecycleStatus?: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ARCHIVED' | 'DEPRECATED';
  reviewDueDate?: Date;
}

export class CustomerGalleryService {
  /**
   * 1. PRIVATE PRODUCT GALLERY & MULTI-TENANT SEARCH ENGINE
   */
  static async getPrivateGalleryProducts(customerId: string, filters?: { search?: string; category?: string; tag?: string }) {
    const user = await prisma.customerPortalUser.findUnique({ where: { id: customerId } });
    if (!user) throw new Error('Customer user not found.');

    const visibilities = await prisma.customerProductVisibility.findMany({
      where: {
        OR: [
          { customerId: user.id },
          { orgId: user.orgId || 'NONE' },
          { visibilityScope: 'PUBLIC' }
        ]
      }
    });

    const productIds = visibilities.map(v => v.productId);
    const where: any = {};
    if (productIds.length > 0) {
      where.id = { in: productIds };
    }

    if (filters?.category) where.category = filters.category;
    if (filters?.search) {
      where.OR = [
        { nameAr: { contains: filters.search } },
        { nameEn: { contains: filters.search } },
        { productCode: { contains: filters.search } }
      ];
    }

    const products = await prisma.productMaster.findMany({ where, take: 50 });
    return products.map(p => ({
      id: p.id,
      productCode: p.productCode,
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      category: p.category,
      silverPurity: p.silverPurity,
      silverWeightGrams: p.silverWeightGrams
    }));
  }

  /**
   * 2. CUSTOMER COLLECTIONS & CUSTOM FOLDERS
   */
  static async createCollection(customerId: string, input: { collectionName: string; description?: string; folderIcon?: string }) {
    return await prisma.customerProductCollection.create({
      data: {
        customerId,
        collectionName: input.collectionName,
        description: input.description || null,
        folderIcon: input.folderIcon || 'folder'
      }
    });
  }

  static async listCollections(customerId: string) {
    return await prisma.customerProductCollection.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 3. DESIGN ASSET LIBRARY, INTEGRITY HASH, STORAGE TRACKING & 3D/AR VIEWER
   */
  static async uploadDesignAsset(customerId: string, input: UploadAssetInput) {
    // SHA-256 Integrity Hash Preparation
    const shaInput = `${input.fileUrl}:${Date.now()}`;
    const integritySha256 = createHash('sha256').update(shaInput).digest('hex');

    // Storage Usage Tracking
    const userAssets = await prisma.customerDesignAsset.findMany({ where: { customerId, isDeleted: false } });
    const currentStorageBytes = userAssets.reduce((acc, a) => acc + a.fileSizeBytes, 0);
    const quotaBytes = 10 * 1024 * 1024 * 1024; // 10 GB Storage Quota

    if (currentStorageBytes + (input.fileSizeBytes || 0) > quotaBytes) {
      throw new Error('Storage quota limit (10 GB) exceeded.');
    }

    const asset = await prisma.customerDesignAsset.create({
      data: {
        customerId,
        productId: input.productId || null,
        assetName: input.assetName,
        fileUrl: input.fileUrl,
        previewUrl: input.previewUrl || input.fileUrl,
        model3dUrl: input.model3dUrl || null,
        fileType: input.fileType,
        version: 'V1',
        isActiveVersion: true,
        lifecycleStatus: input.lifecycleStatus || 'APPROVED',
        integritySha256,
        fileSizeBytes: input.fileSizeBytes || 2048500,
        designerName: input.designerName || 'أخصائي التصميم 3D',
        tagsJson: input.tags ? JSON.stringify(input.tags) : null,
        dependenciesJson: input.dependencies ? JSON.stringify(input.dependencies) : null,
        reviewDueDate: input.reviewDueDate || null
      }
    });

    // Create Initial Version History V1
    await prisma.customerDesignVersionHistory.create({
      data: {
        assetId: asset.id,
        versionNumber: 'V1',
        fileUrl: asset.fileUrl,
        integritySha256,
        changeNotes: 'الإصدار الأول المعتمد (Initial V1 Upload)'
      }
    });

    return { asset, currentStorageBytes: currentStorageBytes + asset.fileSizeBytes };
  }

  /**
   * 4. DESIGN VERSION MANAGEMENT & VERSION ROLLBACK
   */
  static async createDesignVersion(customerId: string, assetId: string, input: { fileUrl: string; changeNotes: string }) {
    const asset = await prisma.customerDesignAsset.findFirst({
      where: { id: assetId, customerId }
    });

    if (!asset) throw new Error('Design asset not found.');

    const currVerNum = parseInt(asset.version.replace('V', ''), 10) || 1;
    const nextVer = `V${currVerNum + 1}`;
    const integritySha256 = createHash('sha256').update(`${input.fileUrl}:${Date.now()}`).digest('hex');

    const updatedAsset = await prisma.customerDesignAsset.update({
      where: { id: asset.id },
      data: {
        version: nextVer,
        fileUrl: input.fileUrl,
        integritySha256,
        updatedAt: new Date()
      }
    });

    const verHistory = await prisma.customerDesignVersionHistory.create({
      data: {
        assetId: asset.id,
        versionNumber: nextVer,
        fileUrl: input.fileUrl,
        integritySha256,
        changeNotes: input.changeNotes
      }
    });

    return { updatedAsset, verHistory };
  }

  static async rollbackDesignVersion(customerId: string, assetId: string, targetVersion: string) {
    const asset = await prisma.customerDesignAsset.findFirst({
      where: { id: assetId, customerId }
    });

    if (!asset) throw new Error('Design asset not found.');

    const targetVerHistory = await prisma.customerDesignVersionHistory.findFirst({
      where: { assetId, versionNumber: targetVersion }
    });

    if (!targetVerHistory) throw new Error(`Target version '${targetVersion}' not found in history.`);

    const rollbackAsset = await prisma.customerDesignAsset.update({
      where: { id: asset.id },
      data: {
        version: targetVersion,
        fileUrl: targetVerHistory.fileUrl,
        integritySha256: targetVerHistory.integritySha256,
        updatedAt: new Date()
      }
    });

    await prisma.customerDesignVersionHistory.create({
      data: {
        assetId: asset.id,
        versionNumber: targetVersion,
        fileUrl: targetVerHistory.fileUrl,
        rollbackFromVersion: asset.version,
        changeNotes: `استعادة واسترجاع الترجيع إلى الإصدار ${targetVersion}`
      }
    });

    return rollbackAsset;
  }

  /**
   * 5. FAVORITES & BOOKMARKS
   */
  static async toggleFavorite(customerId: string, input: { productId?: string; designAssetId?: string }) {
    const existing = await prisma.customerProductFavorite.findFirst({
      where: {
        customerId,
        productId: input.productId || null,
        designAssetId: input.designAssetId || null
      }
    });

    if (existing) {
      await prisma.customerProductFavorite.delete({ where: { id: existing.id } });
      return { isFavorite: false, message: 'Removed from favorites' };
    } else {
      await prisma.customerProductFavorite.create({
        data: {
          customerId,
          productId: input.productId || null,
          designAssetId: input.designAssetId || null
        }
      });
      return { isFavorite: true, message: 'Added to favorites' };
    }
  }

  static async listFavorites(customerId: string) {
    return await prisma.customerProductFavorite.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 6. ASSET DOWNLOAD LOG & SOFT DELETE (RECYCLE BIN)
   */
  static async logAssetDownload(customerId: string, assetId: string, downloadedBy: string, ipAddress?: string) {
    return await prisma.customerAssetDownloadLog.create({
      data: {
        customerId,
        assetId,
        downloadedBy,
        ipAddress: ipAddress || '127.0.0.1'
      }
    });
  }

  static async softDeleteAsset(customerId: string, assetId: string) {
    const asset = await prisma.customerDesignAsset.findFirst({
      where: { id: assetId, customerId }
    });

    if (!asset) throw new Error('Design asset not found.');

    return await prisma.customerDesignAsset.update({
      where: { id: asset.id },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });
  }
}
