import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, InvoiceStatus, PaymentMode } from '@prisma/client';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceQueryDto,
  PaymentDto,
  InvoiceItemDto,
  GstCalculationDto,
} from './dto';

const ALLOWED_SORT_FIELDS = ['invoiceDate', 'createdAt', 'invoiceNumber', 'totalAmount', 'status'] as const;
type SortField = (typeof ALLOWED_SORT_FIELDS)[number];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu',
  'Delhi', 'Lakshadweep', 'Puducherry',
];

function toNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'bigint') return Number(value);
  if (value && typeof value.toNumber === 'function') return value.toNumber();
  return parseFloat(String(value)) || 0;
}

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  calculateGst(dto: GstCalculationDto) {
    const subtotal = toNumber(dto.subtotal);
    const discountAmount = toNumber(dto.discountAmount ?? 0);
    const taxRate = toNumber(dto.taxRate ?? 18);
    const { patientState, clinicState } = dto;

    const taxableAmount = subtotal - discountAmount;
    const isInterState = patientState !== clinicState;
    const gstRate = taxRate / 100;

    if (isInterState) {
      const igst = Math.round(taxableAmount * gstRate * 100) / 100;
      return { cgst: 0, sgst: 0, igst, totalTax: igst };
    } else {
      const cgst = Math.round(taxableAmount * (gstRate / 2) * 100) / 100;
      const sgst = Math.round(taxableAmount * (gstRate / 2) * 100) / 100;
      return { cgst, sgst, igst: 0, totalTax: cgst + sgst };
    }
  }

  private parseItems(items: string): InvoiceItemDto[] {
    try {
      return JSON.parse(items) as InvoiceItemDto[];
    } catch {
      return [];
    }
  }

  calculateItemTotals(items: InvoiceItemDto[], patientState: string, clinicState: string) {
    const isInterState = patientState !== clinicState;
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    const itemsWithTax = items.map((item) => {
      const quantity = toNumber(item.quantity);
      const unitPrice = toNumber(item.unitPrice);
      const discount = toNumber(item.discount ?? 0);
      const taxRate = toNumber(item.taxRate ?? 18);

      const itemSubtotal = quantity * unitPrice;
      const itemTaxable = itemSubtotal - discount;

      let cgst = 0, sgst = 0, igst = 0;

      if (isInterState) {
        igst = Math.round(itemTaxable * (taxRate / 100) * 100) / 100;
      } else {
        cgst = Math.round(itemTaxable * (taxRate / 200) * 100) / 100;
        sgst = Math.round(itemTaxable * (taxRate / 200) * 100) / 100;
      }

      const itemTotal = itemTaxable + cgst + sgst + igst;

      subtotal += itemSubtotal;
      totalDiscount += discount;
      totalTax += cgst + sgst + igst;

      return {
        ...item,
        cgst,
        sgst,
        igst,
        total: itemTotal,
      };
    });

    return { items: itemsWithTax, subtotal, totalDiscount, totalTax };
  }

  async generateInvoiceNumber(tenantId: string): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `INV-${currentYear}-`;

    const lastInvoice = await this.prisma.invoice.findFirst({
      where: {
        tenantId,
        invoiceNumber: { startsWith: prefix },
        deletedAt: null,
      },
      orderBy: { invoiceNumber: 'desc' },
      select: { invoiceNumber: true },
    });

    let nextNum = 1;
    if (lastInvoice) {
      const match = lastInvoice.invoiceNumber.match(new RegExp(`${prefix}(\\d+)`));
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    return `${prefix}${nextNum.toString().padStart(6, '0')}`;
  }

  async createInvoice(dto: CreateInvoiceDto, createdBy: string, tenantId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId, tenantId, deletedAt: null },
      select: { id: true, address: true },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const clinic = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { address: true },
    });

    const patientState = (patient.address as any)?.state ?? 'Karnataka';
    const clinicState = (clinic?.address as any)?.state ?? 'Karnataka';

    const items = this.parseItems(dto.items);
    const { items: itemsWithTax, subtotal, totalDiscount, totalTax } = this.calculateItemTotals(items, patientState, clinicState);
    const totalAmount = subtotal - toNumber(dto.discountAmount ?? 0) + totalTax;

    const invoiceNumber = await this.generateInvoiceNumber(tenantId);

    const invoice = await this.prisma.invoice.create({
      data: {
        tenantId,
        patientId: dto.patientId,
        visitId: dto.visitId,
        invoiceNumber,
        invoiceDate: new Date(),
        subtotal,
        discountAmount: toNumber(dto.discountAmount ?? 0),
        discountReason: dto.discountReason,
        taxAmount: totalTax,
        totalAmount,
        amountPaid: 0,
        amountDue: totalAmount,
        status: InvoiceStatus.DRAFT,
        notes: dto.notes,
        createdBy,
        items: {
          create: itemsWithTax.map((item, index) => ({
            description: item.description,
            procedureId: item.procedureId,
            patientPackageId: item.patientPackageId,
            quantity: toNumber(item.quantity),
            unitPrice: toNumber(item.unitPrice),
            discount: toNumber(item.discount ?? 0),
            taxRate: toNumber(item.taxRate ?? 18),
            cgst: item.cgst,
            sgst: item.sgst,
            igst: item.igst,
            total: item.total,
            sortOrder: index,
          })),
        },
      },
      include: { items: true },
    });

    if (dto.visitId) {
      await this.prisma.visit.update({
        where: { id: dto.visitId },
        data: { status: 'COMPLETED' },
      });
    }

    return invoice;
  }

  async findAll(query: InvoiceQueryDto, tenantId: string) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;
    const sortBy = ALLOWED_SORT_FIELDS.includes(query.sortBy as SortField) ? query.sortBy : 'invoiceDate';
    const sortOrder = query.sortOrder ?? 'desc';

    const where: Prisma.InvoiceWhereInput = {
      tenantId,
      deletedAt: null,
    };

    if (query.patientId) where.patientId = query.patientId;
    if (query.status) where.status = query.status;
    if (query.from || query.to) {
      where.invoiceDate = {};
      if (query.from) where.invoiceDate.gte = new Date(query.from);
      if (query.to) where.invoiceDate.lte = new Date(query.to);
    }

    const orderBy: Record<string, 'asc' | 'desc'> = { [sortBy as string]: sortOrder };

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        orderBy: orderBy as Prisma.InvoiceOrderByWithRelationInput,
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          patient: { select: { id: true, patientNumber: true, firstName: true, lastName: true } },
          items: { orderBy: { sortOrder: 'asc' } },
          payments: { orderBy: { paymentDate: 'desc' } },
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return { data, meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) } };
  }

  async findOne(id: string, tenantId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id, tenantId, deletedAt: null },
      include: {
        patient: true,
        visit: { select: { id: true, visitNumber: true } },
        items: { orderBy: { sortOrder: 'asc' } },
        payments: { orderBy: { paymentDate: 'desc' }, include: { receiver: { select: { firstName: true, lastName: true } } } },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async updateInvoice(id: string, dto: UpdateInvoiceDto, tenantId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id, tenantId, deletedAt: null },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Only draft invoices can be updated');
    }

    const patient = await this.prisma.patient.findUnique({
      where: { id: invoice.patientId, tenantId, deletedAt: null },
      select: { address: true },
    });

    const clinic = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { address: true },
    });

    const patientState = (patient?.address as any)?.state ?? 'Karnataka';
    const clinicState = (clinic?.address as any)?.state ?? 'Karnataka';

    const updateData: Prisma.InvoiceUpdateInput = {};

    if (dto.notes !== undefined) updateData.notes = dto.notes;
    if (dto.discountAmount !== undefined) updateData.discountAmount = toNumber(dto.discountAmount);
    if (dto.discountReason !== undefined) updateData.discountReason = dto.discountReason;

    if (dto.items !== undefined) {
      const items = this.parseItems(dto.items);
      const { items: itemsWithTax, subtotal, totalDiscount, totalTax } = this.calculateItemTotals(items, patientState, clinicState);
      const totalAmount = subtotal - toNumber(dto.discountAmount ?? invoice.discountAmount) + totalTax;

      updateData.subtotal = subtotal;
      updateData.discountAmount = toNumber(dto.discountAmount ?? invoice.discountAmount);
      updateData.taxAmount = totalTax;
      updateData.totalAmount = totalAmount;
      updateData.amountDue = totalAmount - toNumber(invoice.amountPaid);

      await this.prisma.$transaction(async (tx) => {
        await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
        await tx.invoiceItem.createMany({
          data: itemsWithTax.map((item, index) => ({
            invoiceId: id,
            description: item.description,
            procedureId: item.procedureId,
            patientPackageId: item.patientPackageId,
            quantity: toNumber(item.quantity),
            unitPrice: toNumber(item.unitPrice),
            discount: toNumber(item.discount ?? 0),
            taxRate: toNumber(item.taxRate ?? 18),
            cgst: item.cgst,
            sgst: item.sgst,
            igst: item.igst,
            total: item.total,
            sortOrder: index,
          })),
        });
        await tx.invoice.update({ where: { id }, data: updateData });
      });

      return this.findOne(id, tenantId);
    }

    if (dto.discountAmount !== undefined) {
      const newTotal = toNumber(invoice.subtotal) - toNumber(dto.discountAmount) + toNumber(invoice.taxAmount);
      updateData.totalAmount = newTotal;
      updateData.amountDue = newTotal - toNumber(invoice.amountPaid);
    }

    return this.prisma.invoice.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });
  }

  async issueInvoice(id: string, tenantId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id, tenantId, deletedAt: null },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Only draft invoices can be issued');
    }

    return this.prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.ISSUED },
      include: { items: true, patient: true, payments: true },
    });
  }

  async cancelInvoice(id: string, tenantId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id, tenantId, deletedAt: null },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Cannot cancel paid invoice');
    }

    return this.prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.CANCELLED },
    });
  }

  async recordPayment(id: string, dto: PaymentDto, receivedBy: string, tenantId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id, tenantId, deletedAt: null },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Cannot record payment for cancelled invoice');
    }

    const amount = toNumber(dto.amount);
    const amountDue = toNumber(invoice.amountDue);

    if (amount > amountDue) {
      throw new BadRequestException('Payment amount exceeds due amount');
    }

    const paymentDate = dto.paymentDate ? new Date(dto.paymentDate) : new Date();

    const [payment] = await this.prisma.$transaction([
      this.prisma.payment.create({
        data: {
          tenantId,
          invoiceId: id,
          amount,
          paymentMode: dto.paymentMode,
          referenceNumber: dto.referenceNumber,
          paymentDate,
          receivedBy,
          notes: dto.notes,
        },
      }),
      this.prisma.invoice.update({
        where: { id },
        data: {
          amountPaid: { increment: amount },
          amountDue: { decrement: amount },
          status: amount >= amountDue ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID,
        },
      }),
    ]);

    return payment;
  }

  async getPaymentHistory(invoiceId: string, tenantId: string) {
    return this.prisma.payment.findMany({
      where: { invoiceId, tenantId },
      orderBy: { paymentDate: 'desc' },
      include: { receiver: { select: { firstName: true, lastName: true } } },
    });
  }

  async generatePrintData(id: string, tenantId: string) {
    const invoice = await this.findOne(id, tenantId);

    const clinic = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true, address: true, phone: true, email: true, logoUrl: true, gstin: true },
    });

    return {
      invoice,
      clinic,
      generatedAt: new Date(),
    };
  }

  async getNextInvoiceNumber(tenantId: string) {
    return this.generateInvoiceNumber(tenantId);
  }
}