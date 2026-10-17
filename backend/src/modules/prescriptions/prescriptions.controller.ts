import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  PrescriptionQueryDto,
  CreateRegimenDto,
  UpdateRegimenDto,
} from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CurrentTenant } from '@/common/decorators/current-tenant.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@Controller('prescriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Create prescription for a visit' })
  @ApiResponse({ status: 201, description: 'Prescription created' })
  async create(
    @Body() dto: CreatePrescriptionDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.prescriptionsService.create(dto, user.id, tenant.id);
  }

  @Get()
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'List prescriptions with filters' })
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved' })
  async findAll(
    @Query() query: PrescriptionQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.prescriptionsService.findAll(query, tenant.id);
  }

  @Get(':id')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get prescription details' })
  @ApiResponse({ status: 200, description: 'Prescription retrieved' })
  async findOne(
    @Param('id') id: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.prescriptionsService.findOne(id, tenant.id);
  }

  @Patch(':id')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update prescription' })
  @ApiResponse({ status: 200, description: 'Prescription updated' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePrescriptionDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.prescriptionsService.update(id, dto, user.id, tenant.id);
  }

  @Get(':id/print')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get printable prescription data' })
  @ApiResponse({ status: 200, description: 'Print data retrieved' })
  async getPrintData(
    @Param('id') id: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.prescriptionsService.generatePrintData(id, tenant.id);
  }

  @Post('regimens')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Create reusable regimen' })
  @ApiResponse({ status: 201, description: 'Regimen created' })
  async createRegimen(
    @Body() dto: CreateRegimenDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.prescriptionsService.createRegimen(dto, user.id, tenant.id);
  }

  @Get('regimens')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'List regimens' })
  @ApiResponse({ status: 200, description: 'Regimens retrieved' })
  async getRegimens(
    @Query() query: PrescriptionQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.prescriptionsService.getRegimens(query, tenant.id);
  }

  @Get('regimens/:id')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get regimen details' })
  @ApiResponse({ status: 200, description: 'Regimen retrieved' })
  async getRegimen(
    @Param('id') id: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.prescriptionsService.getRegimen(id, tenant.id);
  }

  @Patch('regimens/:id')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Update regimen' })
  @ApiResponse({ status: 200, description: 'Regimen updated' })
  async updateRegimen(
    @Param('id') id: string,
    @Body() dto: UpdateRegimenDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.prescriptionsService.updateRegimen(id, dto, tenant.id);
  }

  @Delete('regimens/:id')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Delete regimen' })
  @ApiResponse({ status: 200, description: 'Regimen deleted' })
  async deleteRegimen(
    @Param('id') id: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.prescriptionsService.deleteRegimen(id, tenant.id);
  }

  @Post(':id/apply-regimen')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Apply regimen to prescription' })
  @ApiResponse({ status: 200, description: 'Regimen applied' })
  async applyRegimen(
    @Param('id') id: string,
    @Body() body: { regimenId: string },
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.prescriptionsService.applyRegimenToPrescription(id, body.regimenId, user.id, tenant.id);
  }
}