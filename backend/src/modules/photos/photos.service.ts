import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import {
  GetUploadUrlDto,
  CreatePhotoDto,
  UpdatePhotoDto,
  PhotoQueryDto,
  AnnotationDto,
  PhotoComparisonQueryDto,
} from './dto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const THUMBNAIL_SIZE = 300;
const UPLOAD_URL_EXPIRY = 5 * 60; // 5 minutes
const VIEW_URL_EXPIRY = 15 * 60; // 15 minutes

interface S3Config {
  endpoint: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  useSSL: boolean;
}

@Injectable()
export class PhotosService {
  private s3Config: S3Config;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.s3Config = {
      endpoint: configService.get('MINIO_ENDPOINT') ?? 'localhost:9000',
      accessKey: configService.get('MINIO_ACCESS_KEY') ?? 'derma_ai',
      secretKey: configService.get('MINIO_SECRET_KEY') ?? 'derma_ai_dev',
      bucket: configService.get('MINIO_BUCKET') ?? 'derma-ai-photos',
      useSSL: configService.get('MINIO_USE_SSL') === 'true',
    };
  }

  async getUploadUrl(dto: GetUploadUrlDto, userId: string, tenantId: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id: dto.visitId, deletedAt: null },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.status === 'SIGNED') {
      throw new ForbiddenException('Cannot upload photos to signed visit');
    }

    if (!ALLOWED_MIME_TYPES.includes(dto.contentType)) {
      throw new BadRequestException('Invalid file type. Allowed: JPEG, PNG, WebP');
    }

    const objectKey = `tenants/${tenantId}/visits/${dto.visitId}/${Date.now()}-${dto.filename}`;

    const uploadUrl = this.generatePresignedPutUrl(objectKey, dto.contentType);

    return {
      uploadUrl,
      objectKey,
      expiresIn: UPLOAD_URL_EXPIRY,
    };
  }

  async registerPhoto(dto: CreatePhotoDto, uploadedBy: string, tenantId: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id: dto.visitId, deletedAt: null },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (parseInt(dto.fileSizeBytes, 10) > MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    const photo = await this.prisma.photo.create({
      data: {
        tenantId,
        patientId: visit.patientId,
        visitId: dto.visitId,
        storageKey: dto.storageKey,
        thumbnailKey: dto.thumbnailKey,
        originalFilename: dto.originalFilename,
        mimeType: dto.mimeType,
        fileSizeBytes: BigInt(dto.fileSizeBytes),
        bodyRegion: dto.bodyRegion,
        bodySubRegion: dto.bodySubRegion,
        uploadedBy,
        marketingConsent: dto.marketingConsent === 'true',
      },
    });

    await this.triggerThumbnailGeneration(dto.storageKey, dto.thumbnailKey);

    return photo;
  }

  async findAll(query: PhotoQueryDto, tenantId: string) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;
    const sortBy = query.sortBy ?? 'captureDate';
    const sortOrder = query.sortOrder ?? 'desc';

    const where: Prisma.PhotoWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (query.patientId) where.patientId = query.patientId;
    if (query.visitId) where.visitId = query.visitId;
    if (query.bodyRegion) where.bodyRegion = query.bodyRegion;
    if (query.bodySubRegion) where.bodySubRegion = query.bodySubRegion;
    if (query.from || query.to) {
      where.captureDate = {};
      if (query.from) where.captureDate.gte = new Date(query.from);
      if (query.to) where.captureDate.lte = new Date(query.to);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.photo.findMany({
        where,
        orderBy: orderBy as Prisma.PhotoOrderByWithRelationInput,
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          storageKey: true,
          thumbnailKey: true,
          originalFilename: true,
          mimeType: true,
          fileSizeBytes: true,
          bodyRegion: true,
          bodySubRegion: true,
          captureDate: true,
          uploadedBy: true,
          marketingConsent: true,
          createdAt: true,
        },
      }),
      this.prisma.photo.count({ where }),
    ]);

    return {
      data,
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }

  async findByPatient(patientId: string, tenantId: string) {
    return this.prisma.photo.findMany({
      where: { tenantId, patientId, deletedAt: null },
      orderBy: { captureDate: 'desc' },
      include: {
        visit: { select: { id: true, visitNumber: true, createdAt: true } },
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id, tenantId, deletedAt: null },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    return photo;
  }

  async getSignedViewUrl(id: string, userId: string, tenantId: string) {
    const photo = await this.findOne(id, tenantId);

    const signedUrl = this.generatePresignedGetUrl(photo.storageKey);
    const thumbnailUrl = photo.thumbnailKey
      ? this.generatePresignedGetUrl(photo.thumbnailKey)
      : null;

    await this.prisma.photoAccessLog.create({
      data: {
        photoId: photo.id,
        userId,
        accessType: 'view',
        ipAddress: 'unknown',
      },
    });

    return {
      ...photo,
      signedUrl,
      thumbnailSignedUrl: thumbnailUrl,
      signedUrlExpiresIn: VIEW_URL_EXPIRY,
    };
  }

  async updatePhoto(id: string, dto: UpdatePhotoDto, tenantId: string) {
    const photo = await this.findOne(id, tenantId);

    const updateData: Prisma.PhotoUpdateInput = {};
    if (dto.bodyRegion !== undefined) updateData.bodyRegion = dto.bodyRegion;
    if (dto.bodySubRegion !== undefined) updateData.bodySubRegion = dto.bodySubRegion;
    if (dto.annotations !== undefined) updateData.annotations = JSON.parse(dto.annotations) as Prisma.InputJsonValue;
    if (dto.marketingConsent !== undefined) updateData.marketingConsent = dto.marketingConsent === 'true';

    return this.prisma.photo.update({
      where: { id },
      data: updateData,
    });
  }

  async addAnnotation(id: string, annotation: AnnotationDto, tenantId: string) {
    const photo = await this.findOne(id, tenantId);

    const existingAnnotations = (photo.annotations as unknown as AnnotationDto[]) ?? [];
    existingAnnotations.push(annotation);

    return this.prisma.photo.update({
      where: { id },
      data: { annotations: existingAnnotations as unknown as Prisma.InputJsonValue },
    });
  }

  async softDelete(id: string, tenantId: string) {
    const photo = await this.findOne(id, tenantId);

    return this.prisma.photo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getComparison(query: PhotoComparisonQueryDto, tenantId: string) {
    const photos = await this.prisma.photo.findMany({
      where: {
        tenantId,
        patientId: query.patientId,
        bodyRegion: query.bodyRegion,
        bodySubRegion: query.bodySubRegion ?? undefined,
        deletedAt: null,
      },
      orderBy: { captureDate: 'asc' },
      select: {
        id: true,
        storageKey: true,
        thumbnailKey: true,
        bodyRegion: true,
        bodySubRegion: true,
        captureDate: true,
        annotations: true,
      },
    });

    return photos.map((p) => ({
      ...p,
      signedUrl: this.generatePresignedGetUrl(p.storageKey),
      thumbnailSignedUrl: p.thumbnailKey ? this.generatePresignedGetUrl(p.thumbnailKey) : null,
    }));
  }

  async getAccessLog(photoId: string, tenantId: string) {
    return this.prisma.photoAccessLog.findMany({
      where: {
        photo: { id: photoId, tenantId },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  private generatePresignedPutUrl(objectKey: string, contentType: string): string {
    const url = new URL(`http${this.s3Config.useSSL ? 's' : ''}://${this.s3Config.endpoint}/${this.s3Config.bucket}/${objectKey}`);
    url.searchParams.set('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
    url.searchParams.set('X-Amz-Credential', `${this.s3Config.accessKey}/${new Date().toISOString().slice(0, 10).replace(/-/g, '')}/auto/s3/aws4_request`);
    url.searchParams.set('X-Amz-Date', new Date().toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z');
    url.searchParams.set('X-Amz-Expires', String(UPLOAD_URL_EXPIRY));
    url.searchParams.set('X-Amz-SignedHeaders', 'host;content-type');
    url.searchParams.set('X-Amz-Signature', 'placeholder-signature');

    return url.toString();
  }

  private generatePresignedGetUrl(objectKey: string): string {
    const url = new URL(`http${this.s3Config.useSSL ? 's' : ''}://${this.s3Config.endpoint}/${this.s3Config.bucket}/${objectKey}`);
    url.searchParams.set('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
    url.searchParams.set('X-Amz-Credential', `${this.s3Config.accessKey}/${new Date().toISOString().slice(0, 10).replace(/-/g, '')}/auto/s3/aws4_request`);
    url.searchParams.set('X-Amz-Date', new Date().toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z');
    url.searchParams.set('X-Amz-Expires', String(VIEW_URL_EXPIRY));
    url.searchParams.set('X-Amz-SignedHeaders', 'host');
    url.searchParams.set('X-Amz-Signature', 'placeholder-signature');

    return url.toString();
  }

  private async triggerThumbnailGeneration(storageKey: string, thumbnailKey?: string) {
    console.log(`[Thumbnail] Would generate thumbnail for ${storageKey} -> ${thumbnailKey ?? 'auto'}`);
  }
}