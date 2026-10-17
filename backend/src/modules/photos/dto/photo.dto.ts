import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class GetUploadUrlDto {
  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  visitId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  filename: string;

  @ApiProperty()
  @IsString()
  contentType: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  bodyRegion: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bodySubRegion?: string;
}

export class CreatePhotoDto {
  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  visitId: string;

  @ApiProperty()
  @IsString()
  storageKey: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnailKey?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  originalFilename: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  mimeType: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d+$/, 'Must be a positive number')
  fileSizeBytes: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  bodyRegion: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bodySubRegion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(true|false)$/, 'Must be true or false')
  marketingConsent?: string = 'false';
}

export class UpdatePhotoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bodyRegion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bodySubRegion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  annotations?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(true|false)$/, 'Must be true or false')
  marketingConsent?: string;
}

export class PhotoQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  perPage?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: string = 'captureDate';

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
  @Matches(UUID_REGEX)
  visitId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bodyRegion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bodySubRegion?: string;

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

export class AnnotationDto {
  @ApiProperty()
  type: 'circle' | 'arrow' | 'text' | 'rectangle';

  @ApiProperty()
  coordinates: { x: number; y: number; width?: number; height?: number; radius?: number; x2?: number; y2?: number };

  @ApiPropertyOptional()
  text?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiPropertyOptional()
  strokeWidth?: number;
}

export class PhotoComparisonQueryDto {
  @ApiProperty()
  @Matches(UUID_REGEX)
  patientId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  bodyRegion: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bodySubRegion?: string;
}