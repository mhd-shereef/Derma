import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReportQueryDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(day|week|month|quarter|year|custom)$/)
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom' = 'month';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^(daily|weekly|monthly)$/)
  groupBy?: 'daily' | 'weekly' | 'monthly';
}

export class ExportReportDto {
  @ApiProperty()
  @IsString()
  @Matches(/^(revenue|collections|patients|procedures|packages|dashboard)$/)
  type: 'revenue' | 'collections' | 'patients' | 'procedures' | 'packages' | 'dashboard';

  @ApiProperty()
  @IsString()
  @Matches(/^(pdf|excel)$/)
  format: 'pdf' | 'excel';

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

export interface RevenueDataPoint {
  period: string;
  revenue: number;
  appointments: number;
  newPatients: number;
}

export interface ProcedureAnalytics {
  procedureName: string;
  category: string;
  count: number;
  revenue: number;
}

export interface CollectionModeBreakdown {
  mode: string;
  count: number;
  total: number;
}

export interface DailyTotal {
  date: string;
  total: number;
}