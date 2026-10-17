import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PatientGender } from '@prisma/client';

export class PatientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientNumber: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ enum: PatientGender })
  gender?: PatientGender;

  @ApiProperty()
  phone: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  address?: Record<string, unknown>;

  @ApiPropertyOptional()
  emergencyContact?: Record<string, unknown>;

  @ApiPropertyOptional()
  bloodGroup?: string;

  @ApiProperty({ type: [String] })
  allergies: string[];

  @ApiPropertyOptional()
  medicalHistory?: Record<string, unknown>;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  profilePhotoKey?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PatientDetailResponseDto extends PatientResponseDto {
  @ApiPropertyOptional({ type: [Object] })
  visits?: Array<{
    id: string;
    visitNumber: string;
    status: string;
    chiefComplaint?: string;
    createdAt: Date;
  }>;

  @ApiPropertyOptional({ type: [Object] })
  photos?: Array<{
    id: string;
    storageKey: string;
    thumbnailKey?: string;
    bodyRegion: string;
    bodySubRegion?: string;
    captureDate: Date;
  }>;

  @ApiPropertyOptional({ type: [Object] })
  prescriptions?: Array<{
    id: string;
    notes?: string;
    createdAt: Date;
    items: Array<{
      drugName: string;
      dosage?: string;
      frequency?: string;
      duration?: string;
      route?: string;
      instructions?: string;
    }>;
  }>;
}