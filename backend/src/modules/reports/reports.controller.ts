import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { ReportQueryDto, ExportReportDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentTenant } from '@/common/decorators/current-tenant.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get dashboard summary' })
  @ApiResponse({ status: 200, description: 'Dashboard data' })
  async getDashboard(
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.reportsService.getDashboardSummary(tenant.id);
  }

  @Get('revenue')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get revenue report' })
  @ApiResponse({ status: 200, description: 'Revenue report' })
  async getRevenue(
    @Query() query: ReportQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.reportsService.getRevenueReport(query, tenant.id);
  }

  @Get('collections')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get collections report' })
  @ApiResponse({ status: 200, description: 'Collections report' })
  async getCollections(
    @Query() query: ReportQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.reportsService.getCollectionsReport(query, tenant.id);
  }

  @Get('patients')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get patient volume report' })
  @ApiResponse({ status: 200, description: 'Patient volume report' })
  async getPatients(
    @Query() query: ReportQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.reportsService.getPatientVolumeReport(query, tenant.id);
  }

  @Get('procedures')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get procedure analytics' })
  @ApiResponse({ status: 200, description: 'Procedure analytics' })
  async getProcedures(
    @Query() query: ReportQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.reportsService.getProcedureAnalytics(query, tenant.id);
  }

  @Get('packages')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get package utilization report' })
  @ApiResponse({ status: 200, description: 'Package utilization report' })
  async getPackages(
    @Query() query: ReportQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.reportsService.getPackageUtilization(query, tenant.id);
  }

  @Post('export')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Export report' })
  @ApiResponse({ status: 200, description: 'Report exported' })
  async exportReport(
    @Body() dto: ExportReportDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.reportsService.exportReport(dto, tenant.id);
  }
}