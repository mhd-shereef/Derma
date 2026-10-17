import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, PackageStatus } from '@prisma/client';
import {
  CreateProcedureCatalogDto,
  UpdateProcedureCatalogDto,
  CreatePackageDto,
  UpdatePackageDto,
  SellPackageDto,
  ConsumePackageSessionDto,
  ProcedureCatalogQueryDto,
  PackageQueryDto,
  PatientPackageQueryDto,
} from './dto';

@Injectable()
export class ProceduresService {
  constructor(private readonly prisma: PrismaService) {}

  async createProcedureCatalog(dto: CreateProcedureCatalogDto, tenantId: string) {
    const existing = await this.prisma.procedureCatalog.findFirst({
      where: { tenantId, name: dto.name, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException('Procedure with this name already exists');
    }

    return this.prisma.procedureCatalog.create({
      data: {
        tenantId,
        name: dto.name,
        category: dto.category,
        description: dto.description,
        defaultPrice: dto.defaultPrice,
        durationMinutes: dto.durationMinutes ? parseInt(dto.durationMinutes, 10) : null,
        hsnSacCode: dto.hsnSacCode,
      },
    });
  }

  async getProcedureCatalog(query: ProcedureCatalogQueryDto, tenantId: string) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;

    const where: Prisma.ProcedureCatalogWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (query.category) where.category = query.category;
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';

    const [data, total] = await Promise.all([
      this.prisma.procedureCatalog.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.procedureCatalog.count({ where }),
    ]);

    return { data, meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async updateProcedureCatalog(id: string, dto: UpdateProcedureCatalogDto, tenantId: string) {
    const procedure = await this.prisma.procedureCatalog.findUnique({
      where: { id, tenantId, deletedAt: null },
    });

    if (!procedure) {
      throw new NotFoundException('Procedure not found');
    }

    const updateData: Prisma.ProcedureCatalogUpdateInput = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.defaultPrice !== undefined) updateData.defaultPrice = dto.defaultPrice;
    if (dto.durationMinutes !== undefined) updateData.durationMinutes = parseInt(dto.durationMinutes, 10);
    if (dto.hsnSacCode !== undefined) updateData.hsnSacCode = dto.hsnSacCode;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive === 'true';

    return this.prisma.procedureCatalog.update({
      where: { id },
      data: updateData,
    });
  }

  async createPackage(dto: CreatePackageDto, tenantId: string) {
    const procedure = await this.prisma.procedureCatalog.findUnique({
      where: { id: dto.procedureId, tenantId, deletedAt: null },
    });

    if (!procedure) {
      throw new NotFoundException('Procedure not found');
    }

    return this.prisma.package.create({
      data: {
        tenantId,
        name: dto.name,
        procedureId: dto.procedureId,
        totalSessions: parseInt(dto.totalSessions, 10),
        price: dto.price,
        validityDays: parseInt(dto.validityDays, 10),
        description: dto.description,
      },
    });
  }

  async getPackages(query: PackageQueryDto, tenantId: string) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;

    const where: Prisma.PackageWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';

    const [data, total] = await Promise.all([
      this.prisma.package.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          procedure: { select: { id: true, name: true, category: true, defaultPrice: true } },
        },
      }),
      this.prisma.package.count({ where }),
    ]);

    return { data, meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async updatePackage(id: string, dto: UpdatePackageDto, tenantId: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { id, tenantId, deletedAt: null },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found');
    }

    const updateData: Prisma.PackageUpdateInput = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.procedureId !== undefined) updateData.procedure = { connect: { id: dto.procedureId } };
    if (dto.totalSessions !== undefined) updateData.totalSessions = parseInt(dto.totalSessions, 10);
    if (dto.price !== undefined) updateData.price = dto.price;
    if (dto.validityDays !== undefined) updateData.validityDays = parseInt(dto.validityDays, 10);
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive === 'true';

    return this.prisma.package.update({
      where: { id },
      data: updateData,
      include: { procedure: true },
    });
  }

  async sellPackage(dto: SellPackageDto, createdBy: string, tenantId: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { id: dto.packageId, tenantId, deletedAt: null, isActive: true },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found or inactive');
    }

    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId, tenantId, deletedAt: null },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const purchaseDate = dto.purchaseDate ? new Date(dto.purchaseDate) : new Date();
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + pkg.validityDays);

    return this.prisma.patientPackage.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        packageId: dto.packageId,
        sessionsTotal: pkg.totalSessions,
        sessionsUsed: 0,
        purchaseDate,
        expiryDate,
        status: PackageStatus.ACTIVE,
        createdBy,
      },
      include: {
        package: { include: { procedure: true } },
        patient: { select: { id: true, patientNumber: true, firstName: true, lastName: true } },
      },
    });
  }

  async getPatientPackages(query: PatientPackageQueryDto, tenantId: string) {
    const where: Prisma.PatientPackageWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (query.patientId) where.patientId = query.patientId;
    if (query.status) where.status = query.status as PackageStatus;

    return this.prisma.patientPackage.findMany({
      where,
      orderBy: { purchaseDate: 'desc' },
      include: {
        package: { include: { procedure: true } },
        sessions: { orderBy: { sessionNumber: 'asc' } },
      },
    });
  }

  async consumePackageSession(patientPackageId: string, dto: ConsumePackageSessionDto, tenantId: string) {
    const patientPackage = await this.prisma.patientPackage.findUnique({
      where: { id: patientPackageId, tenantId, deletedAt: null },
      include: { package: true, sessions: true },
    });

    if (!patientPackage) {
      throw new NotFoundException('Patient package not found');
    }

    if (patientPackage.status !== PackageStatus.ACTIVE) {
      throw new BadRequestException(`Package is ${patientPackage.status.toLowerCase()}`);
    }

    if (patientPackage.expiryDate < new Date()) {
      await this.prisma.patientPackage.update({
        where: { id: patientPackageId },
        data: { status: PackageStatus.EXPIRED },
      });
      throw new BadRequestException('Package has expired');
    }

    if (patientPackage.sessionsUsed >= patientPackage.sessionsTotal) {
      throw new BadRequestException('All sessions have been consumed');
    }

    const visit = await this.prisma.visit.findUnique({
      where: { id: dto.visitId, deletedAt: null },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    const sessionNumber = patientPackage.sessionsUsed + 1;

    const existingSession = await this.prisma.packageSession.findUnique({
      where: { patientPackageId_sessionNumber: { patientPackageId, sessionNumber } },
    });

    if (existingSession) {
      throw new ConflictException('Session already consumed');
    }

    const [session, updatedPackage] = await this.prisma.$transaction([
      this.prisma.packageSession.create({
        data: {
          patientPackageId,
          visitId: dto.visitId,
          sessionNumber,
          notes: `Consumed during visit ${visit.visitNumber}`,
        },
      }),
      this.prisma.patientPackage.update({
        where: { id: patientPackageId },
        data: {
          sessionsUsed: { increment: 1 },
          status: patientPackage.sessionsUsed + 1 >= patientPackage.sessionsTotal
            ? PackageStatus.COMPLETED
            : PackageStatus.ACTIVE,
        },
      }),
    ]);

    return { session, patientPackage: updatedPackage };
  }

  async getPackageUtilization(tenantId: string) {
    const packages = await this.prisma.patientPackage.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        package: { include: { procedure: true } },
        sessions: true,
      },
    });

    return packages.map((pp) => ({
      ...pp,
      utilizationRate: pp.sessionsTotal > 0 ? pp.sessionsUsed / pp.sessionsTotal : 0,
      daysRemaining: Math.max(0, Math.ceil((pp.expiryDate.getTime() - Date.now()) / 86400000)),
    }));
  }
}