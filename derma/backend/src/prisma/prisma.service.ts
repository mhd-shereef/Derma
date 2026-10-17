import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { tenantStorage } from '../common/middleware/tenant.middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private bypassHardDelete = false;

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    this.$use(this.softDeleteMiddleware);
    this.$use(this.tenantIsolationMiddleware);

    await this.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  private shouldApplySoftDelete(model?: string): boolean {
    if (!model) return false;
    const softDeleteModels = [
      'Tenant',
      'User',
      'Patient',
      'Appointment',
      'Visit',
      'ProcedureTemplate',
      'ProcedureNote',
      'Photo',
      'Prescription',
      'Regimen',
      'ProcedureCatalog',
      'Package',
      'PatientPackage',
      'Invoice',
    ];
    return softDeleteModels.includes(model);
  }

  private softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
    if (!this.shouldApplySoftDelete(params.model)) {
      return next(params);
    }

    if (params.action === 'findUnique' || params.action === 'findFirst') {
      if (!params.args.where) {
        params.args.where = {};
      }
      if (params.args.where.deletedAt === undefined) {
        params.args.where.deletedAt = null;
      }
    }

    if (params.action === 'findMany') {
      if (!params.args.where) {
        params.args.where = {};
      }
      if (params.args.where.deletedAt === undefined) {
        params.args.where.deletedAt = null;
      }
    }

    if (params.action === 'update' || params.action === 'updateMany') {
      if (!params.args.where) {
        params.args.where = {};
      }
      if (params.args.where.deletedAt === undefined) {
        params.args.where.deletedAt = null;
      }
    }

    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }

    if (params.action === 'deleteMany') {
      if (!this.bypassHardDelete) {
        params.action = 'updateMany';
        if (params.args.data !== undefined) {
          params.args.data.deletedAt = new Date();
        } else {
          params.args.data = { deletedAt: new Date() };
        }
      }
    }

    return next(params);
  };

  private tenantIsolationMiddleware: Prisma.Middleware = async (params, next) => {
    const tenantId = tenantStorage.getStore()?.tenantId || (global as any).currentTenantId;

    if (tenantId && this.shouldApplyTenantFilter(params.model)) {
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        params.args.where = {
          ...params.args.where,
          tenantId,
        };
      }

      if (params.action === 'findMany') {
        if (!params.args.where) {
          params.args.where = {};
        }
        params.args.where.tenantId = tenantId;
      }

      if (params.action === 'create') {
        params.args.data = {
          ...params.args.data,
          tenantId,
        };
      }

      if (params.action === 'update' || params.action === 'updateMany') {
        if (!params.args.where) {
          params.args.where = {};
        }
        params.args.where.tenantId = tenantId;
      }

      if (params.action === 'delete' || params.action === 'deleteMany') {
        if (!params.args.where) {
          params.args.where = {};
        }
        params.args.where.tenantId = tenantId;
      }
    }

    return next(params);
  };

  private shouldApplyTenantFilter(model?: string): boolean {
    if (!model) return false;

    const tenantModels = [
      'User',
      'Patient',
      'Appointment',
      'Visit',
      'VisitVersion',
      'ProcedureTemplate',
      'ProcedureNote',
      'Photo',
      'PhotoAccessLog',
      'Prescription',
      'PrescriptionItem',
      'Regimen',
      'ProcedureCatalog',
      'Package',
      'PatientPackage',
      'PackageSession',
      'Invoice',
      'InvoiceItem',
      'Payment',
      'AuditLog',
      'RefreshToken',
    ];

    return tenantModels.includes(model);
  }

  setTenantId(tenantId: string) {
    (global as any).currentTenantId = tenantId;
  }

  clearTenantId() {
    delete (global as any).currentTenantId;
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    this.bypassHardDelete = true;
    try {
      const models = [
        this.payment,
        this.invoiceItem,
        this.invoice,
        this.packageSession,
        this.patientPackage,
        this.package,
        this.procedureCatalog,
        this.regimen,
        this.prescriptionItem,
        this.prescription,
        this.photoAccessLog,
        this.photo,
        this.procedureNote,
        this.procedureTemplate,
        this.visitVersion,
        this.visit,
        this.appointment,
        this.patient,
        this.refreshToken,
        this.auditLog,
        this.user,
        this.tenant,
      ] as const;

      for (const model of models) {
        // @ts-expect-error - Prisma model delegates have compatible deleteMany
        await model.deleteMany({});
      }
    } finally {
      this.bypassHardDelete = false;
    }
  }
}