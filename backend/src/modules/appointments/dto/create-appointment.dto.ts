import { IsString, IsOptional, MaxLength, Matches, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';

const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class CreateAppointmentDto {
  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  patientId: string;

  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  doctorId: string;

  @ApiProperty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  appointmentDate: string;

  @ApiProperty()
  @Matches(TIME_REGEX, 'Time must be in HH:MM format')
  startTime: string;

  @ApiProperty()
  @Matches(TIME_REGEX, 'Time must be in HH:MM format')
  endTime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  procedureType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAppointmentDto {
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
  @Matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  appointmentDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(TIME_REGEX, 'Time must be in HH:MM format')
  startTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(TIME_REGEX, 'Time must be in HH:MM format')
  endTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  procedureType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CheckInDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CancelAppointmentDto {
  @ApiProperty()
  @IsString()
  @MaxLength(500)
  reason: string;
}

export class AppointmentQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  perPage?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  sortBy?: string = 'appointmentDate';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(asc|desc)$/, 'Sort order must be asc or desc')
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

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
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  to?: string;

  @ApiPropertyOptional({ enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}

export class SlotQueryDto {
  @ApiProperty()
  @Matches(UUID_REGEX, 'Invalid UUID format')
  doctorId: string;

  @ApiProperty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(TIME_REGEX)
  startTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(TIME_REGEX)
  endTime?: string;
}

export class AvailableSlot {
  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  isAvailable: boolean;
}