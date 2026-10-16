import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceQueryDto,
  PaymentDto,
  GstCalculationDto,
} from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CurrentTenant } from '@/common/decorators/current-tenant.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Billing')
@ApiBearerAuth()
@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('invoices')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Create invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created' })
  async createInvoice(
    @Body() dto: CreateInvoiceDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.billingService.createInvoice(dto, user.id, tenant.id);
  }

  @Get('invoices')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'List invoices' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved' })
  async findAll(
    @Query() query: InvoiceQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.billingService.findAll(query, tenant.id);
  }

  @Get('invoices/next-number')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get next invoice number' })
  @ApiResponse({ status: 200, description: 'Next invoice number' })
  async getNextInvoiceNumber(
    @CurrentTenant() tenant: { id: string },
  ) {
    return { invoiceNumber: await this.billingService.getNextInvoiceNumber(tenant.id) };
  }

  @Get('invoices/gst-calculate')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Calculate GST for preview' })
  @ApiResponse({ status: 200, description: 'GST calculation' })
  async calculateGst(@Body() dto: GstCalculationDto) {
    return this.billingService.calculateGst(dto);
  }

  @Get('invoices/:id')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get invoice details' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved' })
  async findOne(
    @Param('id') id: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.billingService.findOne(id, tenant.id);
  }

  @Patch('invoices/:id')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Update draft invoice' })
  @ApiResponse({ status: 200, description: 'Invoice updated' })
  async updateInvoice(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.billingService.updateInvoice(id, dto, tenant.id);
  }

  @Post('invoices/:id/issue')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Issue invoice (finalize)' })
  @ApiResponse({ status: 200, description: 'Invoice issued' })
  async issueInvoice(
    @Param('id') id: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.billingService.issueInvoice(id, tenant.id);
  }

  @Post('invoices/:id/cancel')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Cancel invoice' })
  @ApiResponse({ status: 200, description: 'Invoice cancelled' })
  async cancelInvoice(
    @Param('id') id: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.billingService.cancelInvoice(id, tenant.id);
  }

  @Post('invoices/:id/payments')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Record payment' })
  @ApiResponse({ status: 201, description: 'Payment recorded' })
  async recordPayment(
    @Param('id') id: string,
    @Body() dto: PaymentDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.billingService.recordPayment(id, dto, user.id, tenant.id);
  }

  @Get('invoices/:id/payments')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get payment history' })
  @ApiResponse({ status: 200, description: 'Payment history retrieved' })
  async getPayments(
    @Param('id') id: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.billingService.getPaymentHistory(id, tenant.id);
  }

  @Get('invoices/:id/print')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get printable invoice data' })
  @ApiResponse({ status: 200, description: 'Print data retrieved' })
  async getPrintData(
    @Param('id') id: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.billingService.generatePrintData(id, tenant.id);
  }
}