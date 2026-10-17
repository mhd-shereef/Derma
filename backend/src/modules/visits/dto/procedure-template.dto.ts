import { IsString, IsOptional, IsEnum, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProcedureCategory } from '@prisma/client';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class CreateProcedureTemplateDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ enum: ProcedureCategory })
  @IsEnum(ProcedureCategory)
  category: ProcedureCategory;

  @ApiProperty()
  @IsString()
  fieldsSchema: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  defaultValues?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(true|false)$/, 'Must be true or false')
  isActive?: string = 'true';
}

export class UpdateProcedureTemplateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ enum: ProcedureCategory })
  @IsOptional()
  @IsEnum(ProcedureCategory)
  category?: ProcedureCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fieldsSchema?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  defaultValues?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(true|false)$/, 'Must be true or false')
  isActive?: string;
}

export class ProcedureTemplateQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  perPage?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ProcedureCategory)
  category?: ProcedureCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(true|false)$/, 'Must be true or false')
  isActive?: string;
}

export class ProcedureNoteDto {
  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  visitId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  templateId?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  procedureName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  bodyArea?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  settings?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  complications?: string;
}

export class UpdateProcedureNoteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  procedureName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  bodyArea?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  settings?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  complications?: string;
}