import { IsString, IsOptional, MaxLength, Matches, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceStatus, PaymentMode } from '@prisma/client';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class InvoiceItemDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(UUID_REGEX)
  procedureId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(UUID_REGEX)
  patientPackageId?: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d+$/, 'Must be a positive integer')
  quantity: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  unitPrice: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  discount?: string = '0';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  taxRate?: string = '18.00';
}

export class CreateInvoiceDto {
  @ApiProperty()
  @Matches(UUID_REGEX)
  patientId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(UUID_REGEX)
  visitId?: string;

  @ApiProperty({ type: [InvoiceItemDto] })
  @IsString()
  items: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  discountAmount?: string = '0';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  discountReason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateInvoiceDto {
  @ApiPropertyOptional({ type: [InvoiceItemDto] })
  @IsOptional()
  @IsString()
  items?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  discountAmount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  discountReason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class PaymentDto {
  @ApiProperty()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  amount: string;

  @ApiProperty({ enum: PaymentMode })
  @IsEnum(PaymentMode)
  paymentMode: PaymentMode;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  referenceNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  paymentDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class InvoiceQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  perPage?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: string = 'invoiceDate';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(asc|desc)$/)
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(UUID_REGEX)
  patientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  to?: string;
}

export class GstCalculationDto {
  @ApiProperty()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  subtotal: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  discountAmount?: string = '0';

  @ApiProperty()
  @IsString()
  patientState: string;

  @ApiProperty()
  @IsString()
  clinicState: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  taxRate?: string = '18';
}