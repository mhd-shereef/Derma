import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VisitStatus } from '@prisma/client';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class CreateVisitDto {
  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  patientId: string;

  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  doctorId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  appointmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  chiefComplaint?: string;
}

export class UpdateVisitDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  chiefComplaint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosisCodes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vitals?: string;
}

export class SignVisitDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddendumDto {
  @ApiProperty()
  @IsString()
  @MaxLength(2000)
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class VisitQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  perPage?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(asc|desc)$/, 'Sort order must be asc or desc')
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  patientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  doctorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: VisitStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(DATE_REGEX)
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(DATE_REGEX)
  to?: string;
}

export class Icd10SearchDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  query: string;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: number = 20;
}

export class Icd10Code {
  @ApiProperty()
  code: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  category?: string;
}