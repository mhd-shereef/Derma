import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class CreateProcedureCatalogDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  category: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  defaultPrice: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, 'Must be a positive integer')
  durationMinutes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  hsnSacCode?: string;
}

export class UpdateProcedureCatalogDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  defaultPrice?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, 'Must be a positive integer')
  durationMinutes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  hsnSacCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(true|false)$/)
  isActive?: string;
}

export class CreatePackageDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  procedureId: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d+$/, 'Must be a positive integer')
  totalSessions: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  price: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d+$/, 'Must be a positive integer')
  validityDays: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePackageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(UUID_REGEX)
  procedureId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, 'Must be a positive integer')
  totalSessions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/, 'Must be a positive number')
  price?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, 'Must be a positive integer')
  validityDays?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(true|false)$/)
  isActive?: string;
}

export class SellPackageDto {
  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  patientId: string;

  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  packageId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  purchaseDate?: string;
}

export class ConsumePackageSessionDto {
  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  visitId: string;
}

export class ProcedureCatalogQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  perPage?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(true|false)$/)
  isActive?: string;
}

export class PackageQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  perPage?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(true|false)$/)
  isActive?: string;
}

export class PatientPackageQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Matches(UUID_REGEX)
  patientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}