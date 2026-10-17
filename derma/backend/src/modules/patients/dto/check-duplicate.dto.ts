import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_REGEX = /^(\+91|91)?[6-9]\d{9}$/;

export class CheckDuplicateDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty()
  @Matches(PHONE_REGEX, 'Invalid Indian phone number format')
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(DATE_REGEX, 'Date must be in YYYY-MM-DD format')
  dateOfBirth?: string;
}

export class DuplicatePatientResult {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientNumber: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone: string;

  @ApiPropertyOptional()
  dateOfBirth?: Date | null;

  @ApiProperty()
  similarityScore: number;
}