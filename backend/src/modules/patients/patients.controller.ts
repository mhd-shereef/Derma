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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto, CheckDuplicateDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CurrentTenant } from '@/common/decorators/current-tenant.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Register a new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() dto: CreatePatientDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.patientsService.create(dto, user.id, tenant.id);
  }

  @Get()
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'List/search patients' })
  @ApiResponse({ status: 200, description: 'Patients retrieved successfully' })
  async findAll(@Query() query: PatientQueryDto) {
    return this.patientsService.findAll(query);
  }

  @Post('check-duplicate')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Check for duplicate patient' })
  @ApiResponse({ status: 200, description: 'Duplicate check results' })
  async checkDuplicate(@Body() dto: CheckDuplicateDto) {
    return this.patientsService.checkDuplicate(dto);
  }

  @Get('search')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Quick search patients by name/phone' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(@Query('q') q: string, @Query('limit') limit?: number) {
    return this.patientsService.searchByNameOrPhone(q, limit ?? 10);
  }

  @Get(':id')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get patient details with history' })
  @ApiResponse({ status: 200, description: 'Patient details retrieved' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update patient' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientsService.update(id, dto);
  }

  @Patch(':id/medical-history')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Update patient medical history (versioned)' })
  @ApiResponse({ status: 200, description: 'Medical history updated' })
  async updateMedicalHistory(
    @Param('id') id: string,
    @Body() body: { medicalHistory: Record<string, unknown>; reason?: string },
    @CurrentUser() user: { id: string },
  ) {
    return this.patientsService.updateMedicalHistory(id, body.medicalHistory, user.id, body.reason);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete patient' })
  @ApiResponse({ status: 200, description: 'Patient deleted' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async softDelete(@Param('id') id: string) {
    return this.patientsService.softDelete(id);
  }
}