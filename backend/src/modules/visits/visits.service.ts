import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, VisitStatus, ProcedureCategory } from '@prisma/client';
import {
  CreateVisitDto,
  UpdateVisitDto,
  VisitQueryDto,
  SignVisitDto,
  AddendumDto,
  Icd10SearchDto,
  CreateProcedureTemplateDto,
  UpdateProcedureTemplateDto,
  ProcedureTemplateQueryDto,
  ProcedureNoteDto,
  UpdateProcedureNoteDto,
} from './dto';

const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt', 'visitNumber', 'status'] as const;
type SortField = (typeof ALLOWED_SORT_FIELDS)[number];

const ICD10_CODES = [
  { code: 'L70.0', description: 'Acne vulgaris', category: 'Acne' },
  { code: 'L70.1', description: 'Acne conglobata', category: 'Acne' },
  { code: 'L70.2', description: 'Acne varioliformis', category: 'Acne' },
  { code: 'L70.3', description: 'Acne tropica', category: 'Acne' },
  { code: 'L70.4', description: 'Infantile acne', category: 'Acne' },
  { code: 'L70.5', description: 'Acné excoriée', category: 'Acne' },
  { code: 'L70.8', description: 'Other acne', category: 'Acne' },
  { code: 'L70.9', description: 'Acne, unspecified', category: 'Acne' },
  { code: 'L57.0', description: 'Actinic keratosis', category: 'Keratosis' },
  { code: 'L57.1', description: 'Actinic reticuloid', category: 'Keratosis' },
  { code: 'L57.2', description: 'Cutis rhomboidalis nuchae', category: 'Keratosis' },
  { code: 'L57.3', description: 'Poikiloderma of Civatte', category: 'Keratosis' },
  { code: 'L57.4', description: 'Cutis laxa senilis', category: 'Keratosis' },
  { code: 'L57.5', description: 'Actinic granuloma', category: 'Keratosis' },
  { code: 'L57.8', description: 'Other skin changes due to chronic exposure to nonionizing radiation', category: 'Keratosis' },
  { code: 'L57.9', description: 'Skin changes due to chronic exposure to nonionizing radiation, unspecified', category: 'Keratosis' },
  { code: 'L80', description: 'Vitiligo', category: 'Pigmentation' },
  { code: 'L81.0', description: 'Postinflammatory hyperpigmentation', category: 'Pigmentation' },
  { code: 'L81.1', description: 'Chloasma', category: 'Pigmentation' },
  { code: 'L81.2', description: 'Freckles', category: 'Pigmentation' },
  { code: 'L81.3', description: 'Café au lait spots', category: 'Pigmentation' },
  { code: 'L81.4', description: 'Other melanin hyperpigmentation', category: 'Pigmentation' },
  { code: 'L81.5', description: 'Leukoderma, not elsewhere classified', category: 'Pigmentation' },
  { code: 'L81.6', description: 'Other disorders of diminished melanin formation', category: 'Pigmentation' },
  { code: 'L81.7', description: 'Pigmented purpuric dermatosis', category: 'Pigmentation' },
  { code: 'L81.8', description: 'Other specified disorders of pigmentation', category: 'Pigmentation' },
  { code: 'L81.9', description: 'Disorder of pigmentation, unspecified', category: 'Pigmentation' },
  { code: 'L20.0', description: 'Besnier\'s prurigo', category: 'Eczema' },
  { code: 'L20.8', description: 'Other atopic dermatitis', category: 'Eczema' },
  { code: 'L20.9', description: 'Atopic dermatitis, unspecified', category: 'Eczema' },
  { code: 'L30.0', description: 'Nummular dermatitis', category: 'Eczema' },
  { code: 'L30.1', description: 'Dyshidrosis [pompholyx]', category: 'Eczema' },
  { code: 'L30.2', description: 'Cutaneous autosensitization', category: 'Eczema' },
  { code: 'L30.3', description: 'Infective dermatitis', category: 'Eczema' },
  { code: 'L30.4', description: 'Erythema intertrigo', category: 'Eczema' },
  { code: 'L30.5', description: 'Pityriasis alba', category: 'Eczema' },
  { code: 'L30.8', description: 'Other specified dermatitis', category: 'Eczema' },
  { code: 'L30.9', description: 'Dermatitis, unspecified', category: 'Eczema' },
  { code: 'L40.0', description: 'Psoriasis vulgaris', category: 'Psoriasis' },
  { code: 'L40.1', description: 'Generalized pustular psoriasis', category: 'Psoriasis' },
  { code: 'L40.2', description: 'Acrodermatitis continua', category: 'Psoriasis' },
  { code: 'L40.3', description: 'Pustulosis palmaris et plantaris', category: 'Psoriasis' },
  { code: 'L40.4', description: 'Guttate psoriasis', category: 'Psoriasis' },
  { code: 'L40.5', description: 'Arthropathic psoriasis', category: 'Psoriasis' },
  { code: 'L40.8', description: 'Other psoriasis', category: 'Psoriasis' },
  { code: 'L40.9', description: 'Psoriasis, unspecified', category: 'Psoriasis' },
  { code: 'B00.0', description: 'Herpesviral dermatitis', category: 'Viral' },
  { code: 'B00.1', description: 'Herpesviral keratitis', category: 'Viral' },
  { code: 'B00.2', description: 'Herpesviral gingivostomatitis and pharyngotonsillitis', category: 'Viral' },
  { code: 'B00.3', description: 'Herpesviral meningitis', category: 'Viral' },
  { code: 'B00.4', description: 'Herpesviral encephalitis', category: 'Viral' },
  { code: 'B00.5', description: 'Herpesviral ocular disease', category: 'Viral' },
  { code: 'B00.7', description: 'Disseminated herpesviral disease', category: 'Viral' },
  { code: 'B00.8', description: 'Other forms of herpesviral infection', category: 'Viral' },
  { code: 'B00.9', description: 'Herpesviral infection, unspecified', category: 'Viral' },
  { code: 'B07.0', description: 'Plantar wart', category: 'Viral' },
  { code: 'B07.8', description: 'Other viral warts', category: 'Viral' },
  { code: 'B07.9', description: 'Viral wart, unspecified', category: 'Viral' },
];

interface DiagnosisCode {
  code: string;
  description: string;
}

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async createVisit(dto: CreateVisitDto, doctorId: string, tenantId: string) {
    const visitNumber = await this.generateVisitNumber(tenantId);

    const data: Prisma.VisitUncheckedCreateInput = {
      tenantId,
      visitNumber,
      status: VisitStatus.IN_PROGRESS,
      chiefComplaint: dto.chiefComplaint,
      patientId: dto.patientId,
      doctorId: dto.doctorId,
      appointmentId: dto.appointmentId,
    };

    const visit = await this.prisma.visit.create({ data });

    if (dto.appointmentId) {
      await this.prisma.appointment.update({
        where: { id: dto.appointmentId },
        data: { status: VisitStatus.IN_PROGRESS },
      });
    }

    return visit;
  }

  async findAll(query: VisitQueryDto) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;
    const sortBy = ALLOWED_SORT_FIELDS.includes(query.sortBy as SortField) ? query.sortBy : 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const where: Prisma.VisitWhereInput = {
      deletedAt: null,
    };

    if (query.patientId) where.patientId = query.patientId;
    if (query.doctorId) where.doctorId = query.doctorId;
    if (query.status) where.status = query.status;
    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to) where.createdAt.lte = new Date(query.to);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = { [sortBy as string]: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.visit.findMany({
        where,
        orderBy: orderBy as Prisma.VisitOrderByWithRelationInput,
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          patient: { select: { id: true, patientNumber: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, firstName: true, lastName: true } },
          appointment: { select: { id: true, procedureType: true } },
        },
      }),
      this.prisma.visit.count({ where }),
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
    const visit = await this.prisma.visit.findUnique({
      where: { id, deletedAt: null },
      include: {
        patient: true,
        doctor: {
          select: { id: true, firstName: true, lastName: true, licenseNumber: true, specialization: true },
        },
        appointment: true,
        procedureNotes: {
          include: { template: true, performer: { select: { id: true, firstName: true, lastName: true } } },
        },
        photos: { orderBy: { captureDate: 'desc' } },
        prescriptions: { include: { items: true } },
        versions: { orderBy: { versionNumber: 'desc' }, take: 10 },
      },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    return visit;
  }

  async update(id: string, dto: UpdateVisitDto, userId: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id, deletedAt: null },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.status === VisitStatus.SIGNED) {
      throw new ForbiddenException('Cannot edit signed visit. Use addendum instead.');
    }

    const updateData: Prisma.VisitUpdateInput = {};

    if (dto.chiefComplaint !== undefined) updateData.chiefComplaint = dto.chiefComplaint;
    if (dto.clinicalNotes !== undefined) updateData.clinicalNotes = dto.clinicalNotes;
    if (dto.diagnosisCodes !== undefined) updateData.diagnosisCodes = JSON.parse(dto.diagnosisCodes) as Prisma.InputJsonValue;
    if (dto.vitals !== undefined) updateData.vitals = JSON.parse(dto.vitals) as Prisma.InputJsonValue;

    return this.prisma.visit.update({
      where: { id },
      data: updateData,
    });
  }

  async signVisit(id: string, dto: SignVisitDto, doctorId: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id, deletedAt: null },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.doctorId !== doctorId) {
      throw new ForbiddenException('Only the attending doctor can sign the visit');
    }

    if (visit.status === VisitStatus.SIGNED) {
      throw new BadRequestException('Visit is already signed');
    }

    return this.prisma.visit.update({
      where: { id },
      data: {
        status: VisitStatus.SIGNED,
        signedAt: new Date(),
        signedBy: doctorId,
        clinicalNotes: dto.notes ? `${visit.clinicalNotes ?? ''}\n\nSign-off notes: ${dto.notes}`.trim() : visit.clinicalNotes,
      },
    });
  }

  async addAddendum(id: string, dto: AddendumDto, doctorId: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id, deletedAt: null },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.doctorId !== doctorId) {
      throw new ForbiddenException('Only the attending doctor can add addendum');
    }

    if (visit.status !== VisitStatus.SIGNED && visit.status !== VisitStatus.COMPLETED) {
      throw new BadRequestException('Addendum can only be added to signed or completed visits');
    }

    const addendumContent = `\n\n--- ADDENDUM (${new Date().toISOString()}) ---\n${dto.content}\n${dto.reason ? `Reason: ${dto.reason}` : ''}`;

    return this.prisma.visit.update({
      where: { id },
      data: {
        status: VisitStatus.AMENDED,
        clinicalNotes: `${visit.clinicalNotes ?? ''}${addendumContent}`,
      },
    });
  }

  async getVersions(id: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id, deletedAt: null },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    return this.prisma.visitVersion.findMany({
      where: { visitId: id },
      orderBy: { versionNumber: 'desc' },
    });
  }

  async createProcedureNote(dto: ProcedureNoteDto, performedBy: string, tenantId: string) {
    const visit = await this.prisma.visit.findUnique({
      where: { id: dto.visitId, deletedAt: null },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.status === VisitStatus.SIGNED) {
      throw new ForbiddenException('Cannot add procedure notes to signed visit');
    }

    const data: Prisma.ProcedureNoteUncheckedCreateInput = {
      tenantId,
      visitId: dto.visitId,
      templateId: dto.templateId,
      procedureName: dto.procedureName,
      bodyArea: dto.bodyArea,
      settings: dto.settings ? JSON.parse(dto.settings) : null,
      notes: dto.notes,
      complications: dto.complications,
      performedBy,
    };

    return this.prisma.procedureNote.create({ data });
  }

  async getProcedureNotes(visitId: string) {
    return this.prisma.procedureNote.findMany({
      where: { visitId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      include: { template: true, performer: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async updateProcedureNote(id: string, dto: UpdateProcedureNoteDto) {
    const note = await this.prisma.procedureNote.findUnique({
      where: { id, deletedAt: null },
    });

    if (!note) {
      throw new NotFoundException('Procedure note not found');
    }

    const visit = await this.prisma.visit.findUnique({
      where: { id: note.visitId, deletedAt: null },
    });

    if (visit?.status === VisitStatus.SIGNED) {
      throw new ForbiddenException('Cannot edit procedure notes on signed visit');
    }

    const updateData: Prisma.ProcedureNoteUpdateInput = {};
    if (dto.procedureName !== undefined) updateData.procedureName = dto.procedureName;
    if (dto.bodyArea !== undefined) updateData.bodyArea = dto.bodyArea;
    if (dto.settings !== undefined) updateData.settings = dto.settings ? JSON.parse(dto.settings) : null;
    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.complications !== undefined) updateData.complications = dto.complications;

    return this.prisma.procedureNote.update({
      where: { id },
      data: updateData,
    });
  }

  async createProcedureTemplate(dto: CreateProcedureTemplateDto, tenantId?: string) {
    const data: Prisma.ProcedureTemplateCreateInput = {
      name: dto.name,
      category: dto.category,
      fieldsSchema: JSON.parse(dto.fieldsSchema),
      defaultValues: dto.defaultValues ? JSON.parse(dto.defaultValues) : null,
      instructions: dto.instructions,
      isActive: dto.isActive === 'true',
      tenant: tenantId ? { connect: { id: tenantId } } : undefined,
    };

    return this.prisma.procedureTemplate.create({ data });
  }

  async getProcedureTemplates(query: ProcedureTemplateQueryDto, tenantId: string) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;

    const where: Prisma.ProcedureTemplateWhereInput = {
      deletedAt: null,
      OR: [
        { tenantId },
        { tenantId: null },
      ],
    };

    if (query.category) where.category = query.category;
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true';

    const [data, total] = await Promise.all([
      this.prisma.procedureTemplate.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.procedureTemplate.count({ where }),
    ]);

    return {
      data,
      meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
    };
  }

  async updateProcedureTemplate(id: string, dto: UpdateProcedureTemplateDto) {
    const updateData: Prisma.ProcedureTemplateUpdateInput = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.fieldsSchema !== undefined) updateData.fieldsSchema = JSON.parse(dto.fieldsSchema);
    if (dto.defaultValues !== undefined) updateData.defaultValues = dto.defaultValues ? JSON.parse(dto.defaultValues) : null;
    if (dto.instructions !== undefined) updateData.instructions = dto.instructions;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive === 'true';

    return this.prisma.procedureTemplate.update({
      where: { id },
      data: updateData,
    });
  }

  async searchIcd10(dto: Icd10SearchDto) {
    const query = dto.query.toLowerCase();
    const limit = dto.limit ?? 20;

    return ICD10_CODES
      .filter((c) => c.code.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
      .slice(0, limit);
  }

  async getMostUsedIcd10(doctorId: string, limit = 10) {
    const visits = await this.prisma.visit.findMany({
      where: { doctorId, deletedAt: null, diagnosisCodes: { not: Prisma.DbNull } },
      select: { diagnosisCodes: true },
      take: 100,
    });

    const codeCounts: Record<string, { code: string; description: string; count: number }> = {};

    for (const visit of visits) {
      const codes = (visit.diagnosisCodes as unknown as DiagnosisCode[]) ?? [];
      for (const code of codes) {
        if (!codeCounts[code.code]) {
          codeCounts[code.code] = { code: code.code, description: code.description, count: 0 };
        }
        codeCounts[code.code].count++;
      }
    }

    return Object.values(codeCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  private async generateVisitNumber(tenantId: string): Promise<string> {
    const lastVisit = await this.prisma.visit.findFirst({
      where: { tenantId, deletedAt: null },
      orderBy: { visitNumber: 'desc' },
      select: { visitNumber: true },
    });

    if (!lastVisit) {
      return 'VIS-0001';
    }

    const match = lastVisit.visitNumber.match(/VIS-(\d+)/);
    if (match) {
      const nextNum = parseInt(match[1], 10) + 1;
      return `VIS-${nextNum.toString().padStart(4, '0')}`;
    }

    return 'VIS-0001';
  }
}