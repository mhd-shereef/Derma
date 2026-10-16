import { IsString, IsOptional, IsEmail, IsEnum, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { PatientGender } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_REGEX = /^(\+91|91)?[6-9]\d{9}$/;

class AddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  line1?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;
}

class EmergencyContactDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(PHONE_REGEX, 'Invalid Indian phone number')
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  relation?: string;
}

class MedicalHistoryDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsString()
  chronicConditions?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsString()
  pastSurgeries?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsString()
  currentMedications?: string;
}

export class CreatePatientDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(DATE_REGEX, 'Date must be in YYYY-MM-DD format')
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: PatientGender })
  @IsOptional()
  @IsEnum(PatientGender)
  gender?: PatientGender;

  @ApiProperty()
  @Matches(PHONE_REGEX, 'Invalid Indian phone number format')
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5)
  bloodGroup?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  allergies?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => MedicalHistoryDto)
  medicalHistory?: MedicalHistoryDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}