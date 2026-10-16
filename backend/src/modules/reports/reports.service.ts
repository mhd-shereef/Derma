import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ReportQueryDto, ExportReportDto, RevenueDataPoint, ProcedureAnalytics } from './dto';

function toNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'bigint') return Number(value);
  if (value && typeof value.toNumber === 'function') return value.toNumber();
  return parseFloat(String(value)) || 0;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private getDateRange(query: ReportQueryDto) {
    const to = query.to ? new Date(query.to) : new Date();
    let from: Date;

    if (query.from) {
      from = new Date(query.from);
    } else {
      from = new Date(to);
      switch (query.period ?? 'month') {
        case 'day':
          from.setDate(from.getDate() - 1);
          break;
        case 'week':
          from.setDate(from.getDate() - 7);
          break;
        case 'month':
          from.setMonth(from.getMonth() - 1);
          break;
        case 'quarter':
          from.setMonth(from.getMonth() - 3);
          break;
        case 'year':
          from.setFullYear(from.getFullYear() - 1);
          break;
        default:
          from.setMonth(from.getMonth() - 1);
      }
    }

    return { from, to };
  }

  async getDashboardSummary(tenantId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayAppointments,
      todayRevenue,
      pendingPayments,
      activePatients,
      totalPatients,
    ] = await Promise.all([
      this.prisma.appointment.count({
        where: {
          tenantId,
          deletedAt: null,
          appointmentDate: today,
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        },
      }),
      this.prisma.invoice.aggregate({
        where: {
          tenantId,
          deletedAt: null,
          invoiceDate: { gte: today, lt: tomorrow },
          status: { notIn: ['CANCELLED', 'DRAFT'] },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.invoice.aggregate({
        where: {
          tenantId,
          deletedAt: null,
          status: { in: ['ISSUED', 'PARTIALLY_PAID'] },
        },
        _sum: { amountDue: true },
      }),
      this.prisma.patient.count({
        where: {
          tenantId,
          deletedAt: null,
          visits: { some: { createdAt: { gte: new Date(Date.now() - 30 * 86400000) } } },
        },
      }),
      this.prisma.patient.count({
        where: { tenantId, deletedAt: null },
      }),
    ]);

    return {
      todayAppointments,
      todayRevenue: toNumber(todayRevenue._sum.totalAmount ?? 0),
      pendingPayments: toNumber(pendingPayments._sum.amountDue ?? 0),
      activePatients,
      totalPatients,
    };
  }

  async getRevenueReport(query: ReportQueryDto, tenantId: string) {
    const { from, to } = this.getDateRange(query);
    const groupBy = query.groupBy ?? 'daily';

    const invoices = await this.prisma.invoice.findMany({
      where: {
        tenantId,
        deletedAt: null,
        status: { notIn: ['CANCELLED', 'DRAFT'] },
        invoiceDate: { gte: from, lte: to },
      },
      select: {
        invoiceDate: true,
        totalAmount: true,
        items: { select: { procedureId: true, total: true } },
      },
    });

    const grouped = new Map<string, RevenueDataPoint>();

    for (const inv of invoices) {
      const date = inv.invoiceDate;
      let key: string;

      switch (groupBy) {
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!grouped.has(key)) {
        grouped.set(key, { period: key, revenue: 0, appointments: 0, newPatients: 0 });
      }

      const point = grouped.get(key)!;
      point.revenue += toNumber(inv.totalAmount);
      point.appointments += 1;
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        tenantId,
        deletedAt: null,
        appointmentDate: { gte: from, lte: to },
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
      select: { appointmentDate: true },
    });

    for (const apt of appointments) {
      const date = apt.appointmentDate;
      let key: string;
      switch (groupBy) {
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }
      if (grouped.has(key)) {
        grouped.get(key)!.appointments += 1;
      }
    }

    const newPatients = await this.prisma.patient.findMany({
      where: {
        tenantId,
        deletedAt: null,
        createdAt: { gte: from, lte: to },
      },
      select: { createdAt: true },
    });

    for (const pt of newPatients) {
      const date = pt.createdAt;
      let key: string;
      switch (groupBy) {
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }
      if (grouped.has(key)) {
        grouped.get(key)!.newPatients += 1;
      }
    }

    return Array.from(grouped.values()).sort((a, b) => a.period.localeCompare(b.period));
  }

  async getCollectionsReport(query: ReportQueryDto, tenantId: string) {
    const { from, to } = this.getDateRange(query);

    const payments = await this.prisma.payment.findMany({
      where: {
        tenantId,
        paymentDate: { gte: from, lte: to },
      },
      select: {
        amount: true,
        paymentMode: true,
        paymentDate: true,
        invoice: { select: { patientId: true } },
      },
    });

    const modeBreakdown = new Map<string, { count: number; total: number }>();
    const dailyTotals = new Map<string, number>();

    for (const p of payments) {
      const mode = p.paymentMode;
      if (!modeBreakdown.has(mode)) {
        modeBreakdown.set(mode, { count: 0, total: 0 });
      }
      const m = modeBreakdown.get(mode)!;
      m.count += 1;
      m.total += toNumber(p.amount);

      const dayKey = p.paymentDate.toISOString().split('T')[0];
      dailyTotals.set(dayKey, (dailyTotals.get(dayKey) ?? 0) + toNumber(p.amount));
    }

    const outstanding = await this.prisma.invoice.aggregate({
      where: {
        tenantId,
        deletedAt: null,
        status: { in: ['ISSUED', 'PARTIALLY_PAID'] },
      },
      _sum: { amountDue: true },
    });

    return {
      modeBreakdown: Array.from(modeBreakdown.entries()).map(([mode, data]) => ({
        mode,
        count: data.count,
        total: data.total,
      })),
      dailyTotals: Array.from(dailyTotals.entries())
        .map(([date, total]) => ({ date, total }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      outstandingAmount: toNumber(outstanding._sum.amountDue ?? 0),
    };
  }

  async getPatientVolumeReport(query: ReportQueryDto, tenantId: string) {
    const { from, to } = this.getDateRange(query);

    const [totalPatients, newPatients, returningPatients, appointments] = await Promise.all([
      this.prisma.patient.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.patient.count({
        where: { tenantId, deletedAt: null, createdAt: { gte: from, lte: to } },
      }),
      this.prisma.patient.count({
        where: {
          tenantId,
          deletedAt: null,
          createdAt: { lt: from },
          visits: { some: { createdAt: { gte: from, lte: to } } },
        },
      }),
      this.prisma.appointment.findMany({
        where: {
          tenantId,
          deletedAt: null,
          appointmentDate: { gte: from, lte: to },
        },
        select: { status: true },
      }),
    ]);

    const appointmentStats = appointments.reduce(
      (acc, apt) => {
        acc[apt.status] = (acc[apt.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalAppointments = appointments.length;
    const noShows = appointmentStats['NO_SHOW'] ?? 0;
    const noShowRate = totalAppointments > 0 ? (noShows / totalAppointments) * 100 : 0;

    return {
      totalPatients,
      newPatients,
      returningPatients,
      totalAppointments,
      appointmentStats,
      noShowRate: Math.round(noShowRate * 100) / 100,
    };
  }

  async getProcedureAnalytics(query: ReportQueryDto, tenantId: string) {
    const { from, to } = this.getDateRange(query);

    const procedures = await this.prisma.procedureNote.findMany({
      where: {
        tenantId,
        deletedAt: null,
        createdAt: { gte: from, lte: to },
      },
      include: { visit: { select: { id: true } } },
    });

    const analytics = new Map<string, ProcedureAnalytics>();

    for (const p of procedures) {
      const key = `${p.procedureName}|${p.bodyArea ?? 'N/A'}`;
      if (!analytics.has(key)) {
        analytics.set(key, {
          procedureName: p.procedureName,
          category: 'Unknown',
          count: 0,
          revenue: 0,
        });
      }
      const a = analytics.get(key)!;
      a.count += 1;
    }

    const invoices = await this.prisma.invoice.findMany({
      where: {
        tenantId,
        deletedAt: null,
        status: { notIn: ['CANCELLED', 'DRAFT'] },
        invoiceDate: { gte: from, lte: to },
      },
      include: {
        items: {
          where: { procedureId: { not: null } },
          select: { procedureId: true, total: true },
        },
      },
    });

    for (const inv of invoices) {
      for (const item of inv.items) {
        if (!item.procedureId) continue;
        const proc = await this.prisma.procedureCatalog.findUnique({
          where: { id: item.procedureId },
          select: { name: true, category: true },
        });
        if (proc) {
          const key = `${proc.name}|N/A`;
          if (!analytics.has(key)) {
            analytics.set(key, {
              procedureName: proc.name,
              category: proc.category,
              count: 0,
              revenue: 0,
            });
          }
          const a = analytics.get(key)!;
          a.revenue += toNumber(item.total);
        }
      }
    }

    return Array.from(analytics.values()).sort((a, b) => b.count - a.count);
  }

  async getPackageUtilization(query: ReportQueryDto, tenantId: string) {
    const { from, to } = this.getDateRange(query);

    const packages = await this.prisma.patientPackage.findMany({
      where: {
        tenantId,
        deletedAt: null,
        purchaseDate: { gte: from, lte: to },
      },
      include: {
        package: { include: { procedure: true } },
        sessions: true,
      },
    });

    return packages.map((pp) => ({
      patientPackageId: pp.id,
      packageName: pp.package.name,
      procedureName: pp.package.procedure.name,
      sessionsTotal: pp.sessionsTotal,
      sessionsUsed: pp.sessionsUsed,
      utilizationRate: pp.sessionsTotal > 0 ? pp.sessionsUsed / pp.sessionsTotal : 0,
      purchaseDate: pp.purchaseDate,
      expiryDate: pp.expiryDate,
      status: pp.status,
    }));
  }

  async exportReport(dto: ExportReportDto, tenantId: string) {
    const query: ReportQueryDto = { from: dto.from, to: dto.to, period: 'custom' };
    let data: any;

    switch (dto.type) {
      case 'revenue':
        data = await this.getRevenueReport(query, tenantId);
        break;
      case 'collections':
        data = await this.getCollectionsReport(query, tenantId);
        break;
      case 'patients':
        data = await this.getPatientVolumeReport(query, tenantId);
        break;
      case 'procedures':
        data = await this.getProcedureAnalytics(query, tenantId);
        break;
      case 'packages':
        data = await this.getPackageUtilization(query, tenantId);
        break;
      case 'dashboard':
        data = await this.getDashboardSummary(tenantId);
        break;
    }

    return {
      data,
      meta: {
        reportType: dto.type,
        format: dto.format,
        generatedAt: new Date(),
        dateRange: { from: query.from, to: query.to },
      },
    };
  }
}