import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, PatientGender } from '@prisma/client';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto, CheckDuplicateDto, DuplicatePatientResult } from './dto';

const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt', 'firstName', 'lastName', 'patientNumber', 'phone', 'email'] as const;
type SortField = (typeof ALLOWED_SORT_FIELDS)[number];

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePatientDto, createdBy: string, tenantId: string) {
    const patientNumber = await this.generatePatientNumber();

    const data: Prisma.PatientUncheckedCreateInput = {
      tenantId,
      patientNumber,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
      gender: dto.gender,
      phone: dto.phone,
      email: dto.email,
      address: dto.address as Prisma.InputJsonValue | undefined,
      emergencyContact: dto.emergencyContact as Prisma.InputJsonValue | undefined,
      bloodGroup: dto.bloodGroup,
      allergies: dto.allergies ?? [],
      medicalHistory: dto.medicalHistory as Prisma.InputJsonValue | undefined,
      notes: dto.notes,
      createdBy,
    };

    return this.prisma.patient.create({ data });
  }

  async findAll(query: PatientQueryDto) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;
    const sortBy = ALLOWED_SORT_FIELDS.includes(query.sortBy as SortField) ? query.sortBy : 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';
    const { search, gender, phone, email, dobYear } = query;

    const where: Prisma.PatientWhereInput = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { patientNumber: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (gender) where.gender = gender;
    if (phone) where.phone = { contains: phone };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (dobYear) {
      where.dateOfBirth = {
        gte: new Date(`${dobYear}-01-01`),
        lt: new Date(`${dobYear + 1}-01-01`),
      };
    }

    const orderBy: Record<string, 'asc' | 'desc'> = { [sortBy as string]: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        orderBy: orderBy as Prisma.PatientOrderByWithRelationInput,
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          patientNumber: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          phone: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id, deletedAt: null },
      include: {
        visits: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            visitNumber: true,
            status: true,
            chiefComplaint: true,
            createdAt: true,
          },
        },
        photos: {
          orderBy: { captureDate: 'desc' },
          take: 20,
          select: {
            id: true,
            storageKey: true,
            thumbnailKey: true,
            bodyRegion: true,
            bodySubRegion: true,
            captureDate: true,
          },
        },
        prescriptions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            items: true,
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async update(id: string, dto: UpdatePatientDto) {
    const patient = await this.prisma.patient.findUnique({
      where: { id, deletedAt: null },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const updateData: Prisma.PatientUpdateInput = {};

    if (dto.firstName !== undefined) updateData.firstName = dto.firstName;
    if (dto.lastName !== undefined) updateData.lastName = dto.lastName;
    if (dto.dateOfBirth !== undefined) updateData.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : null;
    if (dto.gender !== undefined) updateData.gender = dto.gender;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.address !== undefined) updateData.address = dto.address as Prisma.InputJsonValue | undefined;
    if (dto.emergencyContact !== undefined) updateData.emergencyContact = dto.emergencyContact as Prisma.InputJsonValue | undefined;
    if (dto.bloodGroup !== undefined) updateData.bloodGroup = dto.bloodGroup;
    if (dto.allergies !== undefined) updateData.allergies = dto.allergies;
    if (dto.medicalHistory !== undefined) updateData.medicalHistory = dto.medicalHistory as Prisma.InputJsonValue | undefined;
    if (dto.notes !== undefined) updateData.notes = dto.notes;

    return this.prisma.patient.update({
      where: { id },
      data: updateData,
    });
  }

  async updateMedicalHistory(id: string, medicalHistory: Record<string, unknown>, changedBy: string, reason?: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id, deletedAt: null },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const currentHistory = (patient.medicalHistory as Record<string, unknown>) ?? {};

    await this.prisma.$transaction(async (tx) => {
      await tx.patient.update({
        where: { id },
        data: { medicalHistory: medicalHistory as Prisma.InputJsonValue },
      });

      const visitVersionCount = await tx.visitVersion.count({ where: { visitId: id } });
      await tx.visitVersion.create({
        data: {
          visitId: id,
          versionNumber: visitVersionCount + 1,
          snapshot: { medicalHistory: currentHistory } as Prisma.InputJsonValue,
          changedBy,
          changeReason: reason ?? 'Medical history updated',
        },
      });
    });

    return this.findOne(id);
  }

  async softDelete(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id, deletedAt: null },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.prisma.patient.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async checkDuplicate(dto: CheckDuplicateDto): Promise<DuplicatePatientResult[]> {
    const where: Prisma.PatientWhereInput = {
      deletedAt: null,
      OR: [
        {
          AND: [
            { firstName: { equals: dto.firstName, mode: 'insensitive' } },
            { lastName: { equals: dto.lastName, mode: 'insensitive' } },
            { phone: dto.phone },
          ],
        },
        {
          AND: [
            { firstName: { equals: dto.firstName, mode: 'insensitive' } },
            { lastName: { equals: dto.lastName, mode: 'insensitive' } },
            { dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null },
          ],
        },
        {
          phone: dto.phone,
        },
      ],
    };

    const patients = await this.prisma.patient.findMany({
      where,
      select: {
        id: true,
        patientNumber: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
      },
    });

    return patients.map((p) => ({
      ...p,
      dateOfBirth: p.dateOfBirth ?? undefined,
      similarityScore: this.calculateSimilarity(dto, p),
    })).sort((a, b) => b.similarityScore - a.similarityScore);
  }

  async searchByNameOrPhone(search: string, limit = 10) {
    if (search.length < 2) {
      return [];
    }

    return this.prisma.patient.findMany({
      where: {
        deletedAt: null,
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { patientNumber: { contains: search, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        patientNumber: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        dateOfBirth: true,
        gender: true,
      },
    });
  }

  private async generatePatientNumber(): Promise<string> {
    const lastPatient = await this.prisma.patient.findFirst({
      where: { deletedAt: null },
      orderBy: { patientNumber: 'desc' },
      select: { patientNumber: true },
    });

    if (!lastPatient) {
      return 'PAT-0001';
    }

    const match = lastPatient.patientNumber.match(/PAT-(\d+)/);
    if (match) {
      const nextNum = parseInt(match[1], 10) + 1;
      return `PAT-${nextNum.toString().padStart(4, '0')}`;
    }

    return 'PAT-0001';
  }

  private calculateSimilarity(dto: CheckDuplicateDto, patient: { firstName: string; lastName: string; phone: string; dateOfBirth?: Date | null }): number {
    let score = 0;

    if (dto.firstName.toLowerCase() === patient.firstName.toLowerCase()) score += 30;
    if (dto.lastName.toLowerCase() === patient.lastName.toLowerCase()) score += 30;
    if (dto.phone === patient.phone) score += 30;
    if (dto.dateOfBirth && patient.dateOfBirth && new Date(dto.dateOfBirth).getTime() === patient.dateOfBirth.getTime()) score += 10;

    return score;
  }
}