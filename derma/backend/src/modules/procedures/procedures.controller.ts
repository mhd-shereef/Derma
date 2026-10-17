import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProceduresService } from './procedures.service';
import {
  CreateProcedureCatalogDto,
  UpdateProcedureCatalogDto,
  CreatePackageDto,
  UpdatePackageDto,
  SellPackageDto,
  ConsumePackageSessionDto,
  ProcedureCatalogQueryDto,
  PackageQueryDto,
  PatientPackageQueryDto,
} from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CurrentTenant } from '@/common/decorators/current-tenant.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Procedures & Packages')
@ApiBearerAuth()
@Controller('procedures')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  @Post('catalog')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Add procedure to catalog' })
  @ApiResponse({ status: 201, description: 'Procedure created' })
  async createCatalog(
    @Body() dto: CreateProcedureCatalogDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.proceduresService.createProcedureCatalog(dto, tenant.id);
  }

  @Get('catalog')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'List procedure catalog' })
  @ApiResponse({ status: 200, description: 'Procedures retrieved' })
  async getCatalog(
    @Query() query: ProcedureCatalogQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.proceduresService.getProcedureCatalog(query, tenant.id);
  }

  @Patch('catalog/:id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Update procedure catalog entry' })
  @ApiResponse({ status: 200, description: 'Procedure updated' })
  async updateCatalog(
    @Param('id') id: string,
    @Body() dto: UpdateProcedureCatalogDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.proceduresService.updateProcedureCatalog(id, dto, tenant.id);
  }

  @Post('packages')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Create package definition' })
  @ApiResponse({ status: 201, description: 'Package created' })
  async createPackage(
    @Body() dto: CreatePackageDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.proceduresService.createPackage(dto, tenant.id);
  }

  @Get('packages')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'List packages' })
  @ApiResponse({ status: 200, description: 'Packages retrieved' })
  async getPackages(
    @Query() query: PackageQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.proceduresService.getPackages(query, tenant.id);
  }

  @Patch('packages/:id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Update package' })
  @ApiResponse({ status: 200, description: 'Package updated' })
  async updatePackage(
    @Param('id') id: string,
    @Body() dto: UpdatePackageDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.proceduresService.updatePackage(id, dto, tenant.id);
  }

  @Post('packages/sell')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Sell package to patient' })
  @ApiResponse({ status: 201, description: 'Package sold' })
  async sellPackage(
    @Body() dto: SellPackageDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.proceduresService.sellPackage(dto, user.id, tenant.id);
  }

  @Get('packages/patient/:patientId')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get patient packages' })
  @ApiResponse({ status: 200, description: 'Patient packages retrieved' })
  async getPatientPackages(
    @Param('patientId') patientId: string,
    @Query() query: PatientPackageQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.proceduresService.getPatientPackages({ ...query, patientId }, tenant.id);
  }

  @Post('packages/:id/consume')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Consume package session' })
  @ApiResponse({ status: 200, description: 'Session consumed' })
  async consumeSession(
    @Param('id') id: string,
    @Body() dto: ConsumePackageSessionDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.proceduresService.consumePackageSession(id, dto, tenant.id);
  }

  @Get('packages/utilization')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get package utilization report' })
  @ApiResponse({ status: 200, description: 'Utilization data retrieved' })
  async getUtilization(
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.proceduresService.getPackageUtilization(tenant.id);
  }
}