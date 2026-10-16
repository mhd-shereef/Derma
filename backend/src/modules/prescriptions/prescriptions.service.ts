import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, VisitStatus } from '@prisma/client';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  PrescriptionQueryDto,
  CreateRegimenDto,
  UpdateRegimenDto,
  PrescriptionItemDto,
} from './dto';

const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt'] as const;
type SortField = (typeof ALLOWED_SORT_FIELDS)[number];

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  private parseItems(items: string): PrescriptionItemDto[] {
    try {
      return JSON.parse(items) as PrescriptionItemDto[];
    } catch {
      return [];
    }
  }

  async create(dto: CreatePrescriptionDto, doctorId: string, tenantId: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id: dto.visitId, deletedAt: null },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.status === VisitStatus.SIGNED) {
      throw new ForbiddenException('Cannot create prescription for signed visit');
    }

    if (visit.doctorId !== doctorId) {
      throw new ForbiddenException('Only the attending doctor can create prescription');
    }

    const items = this.parseItems(dto.items);

    const prescription = await this.prisma.prescription.create({
      data: {
        tenantId,
        visitId: dto.visitId,
        patientId: visit.patientId,
        doctorId,
        notes: dto.notes,
        items: {
          create: items.map((item, index) => ({
            drugName: item.drugName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            route: item.route,
            instructions: item.instructions,
            sortOrder: parseInt(item.sortOrder ?? String(index), 10),
          })),
        },
      },
      include: { items: true },
    });

    return prescription;
  }

  async findAll(query: PrescriptionQueryDto, tenantId: string) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;
    const sortBy = ALLOWED_SORT_FIELDS.includes(query.sortBy as SortField) ? query.sortBy : 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const where: Prisma.PrescriptionWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (query.patientId) where.patientId = query.patientId;
    if (query.visitId) where.visitId = query.visitId;
    if (query.doctorId) where.doctorId = query.doctorId;
    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to) where.createdAt.lte = new Date(query.to);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = { [sortBy as string]: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.prescription.findMany({
        where,
        orderBy: orderBy as Prisma.PrescriptionOrderByWithRelationInput,
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          items: { orderBy: { sortOrder: 'asc' } },
          patient: { select: { id: true, patientNumber: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, firstName: true, lastName: true, licenseNumber: true } },
          visit: { select: { id: true, visitNumber: true } },
        },
      }),
      this.prisma.prescription.count({ where }),
    ]);

    return {
      data,
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }

  async findOne(id: string, tenantId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id, tenantId, deletedAt: null },
      include: {
        items: { orderBy: { sortOrder: 'asc' } },
        patient: true,
        doctor: { select: { id: true, firstName: true, lastName: true, licenseNumber: true, specialization: true } },
        visit: { select: { id: true, visitNumber: true, createdAt: true } },
      },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    return prescription;
  }

  async update(id: string, dto: UpdatePrescriptionDto, doctorId: string, tenantId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id, tenantId, deletedAt: null },
      include: { visit: true },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (prescription.doctorId !== doctorId) {
      throw new ForbiddenException('Only the attending doctor can update prescription');
    }

    if (prescription.visit?.status === VisitStatus.SIGNED) {
      throw new ForbiddenException('Cannot update prescription for signed visit');
    }

    await this.prisma.$transaction(async (tx) => {
      if (dto.notes !== undefined) {
        await tx.prescription.update({
          where: { id },
          data: { notes: dto.notes },
        });
      }

      if (dto.items !== undefined) {
        const items = this.parseItems(dto.items);
        await tx.prescriptionItem.deleteMany({ where: { prescriptionId: id } });
        await tx.prescriptionItem.createMany({
          data: items.map((item, index) => ({
            prescriptionId: id,
            drugName: item.drugName,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            route: item.route,
            instructions: item.instructions,
            sortOrder: parseInt(item.sortOrder ?? String(index), 10),
          })),
        });
      }
    });

    return this.findOne(id, tenantId);
  }

  async createRegimen(dto: CreateRegimenDto, createdBy: string, tenantId: string) {
    const items = this.parseItems(dto.items);
    return this.prisma.regimen.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        items: items as unknown as Prisma.InputJsonValue,
        createdBy,
      },
    });
  }

  async getRegimens(query: PrescriptionQueryDto, tenantId: string) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;

    const where: Prisma.RegimenWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to) where.createdAt.lte = new Date(query.to);
    }

    const [data, total] = await Promise.all([
      this.prisma.regimen.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.regimen.count({ where }),
    ]);

    return { data, meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async getRegimen(id: string, tenantId: string) {
    const regimen = await this.prisma.regimen.findUnique({
      where: { id, tenantId, deletedAt: null },
    });

    if (!regimen) {
      throw new NotFoundException('Regimen not found');
    }

    return regimen;
  }

  async updateRegimen(id: string, dto: UpdateRegimenDto, tenantId: string) {
    const regimen = await this.prisma.regimen.findUnique({
      where: { id, tenantId, deletedAt: null },
    });

    if (!regimen) {
      throw new NotFoundException('Regimen not found');
    }

    const updateData: Prisma.RegimenUpdateInput = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.items !== undefined) updateData.items = this.parseItems(dto.items) as unknown as Prisma.InputJsonValue;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive === 'true';

    return this.prisma.regimen.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteRegimen(id: string, tenantId: string) {
    const regimen = await this.prisma.regimen.findUnique({
      where: { id, tenantId, deletedAt: null },
    });

    if (!regimen) {
      throw new NotFoundException('Regimen not found');
    }

    return this.prisma.regimen.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async applyRegimenToPrescription(prescriptionId: string, regimenId: string, doctorId: string, tenantId: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id: prescriptionId, tenantId, deletedAt: null },
      include: { visit: true },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found');
    }

    if (prescription.doctorId !== doctorId) {
      throw new ForbiddenException('Only the attending doctor can update prescription');
    }

    if (prescription.visit?.status === VisitStatus.SIGNED) {
      throw new ForbiddenException('Cannot update prescription for signed visit');
    }

    const regimen = await this.prisma.regimen.findUnique({
      where: { id: regimenId, tenantId, deletedAt: null },
    });

    if (!regimen) {
      throw new NotFoundException('Regimen not found');
    }

    const items = (regimen.items as unknown as PrescriptionItemDto[]) ?? [];

    await this.prisma.$transaction(async (tx) => {
      await tx.prescriptionItem.deleteMany({ where: { prescriptionId } });
      await tx.prescriptionItem.createMany({
        data: items.map((item, index) => ({
          prescriptionId,
          drugName: item.drugName,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          route: item.route,
          instructions: item.instructions,
          sortOrder: parseInt(item.sortOrder ?? String(index), 10),
        })),
      });
    });

    return this.findOne(prescriptionId, tenantId);
  }

  async generatePrintData(id: string, tenantId: string) {
    const prescription = await this.findOne(id, tenantId);

    const clinic = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true, address: true, phone: true, email: true, logoUrl: true, gstin: true },
    });

    return {
      prescription,
      clinic,
      generatedAt: new Date(),
    };
  }
}