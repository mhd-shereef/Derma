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
import { VisitsService } from './visits.service';
import {
  CreateVisitDto,
  UpdateVisitDto,
  VisitQueryDto,
  SignVisitDto,
  AddendumDto,
  Icd10SearchDto,
  CreateProcedureTemplateDto,
  UpdateProcedureTemplateDto,
  ProcedureTemplateQueryDto,
  ProcedureNoteDto,
  UpdateProcedureNoteDto,
} from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CurrentTenant } from '@/common/decorators/current-tenant.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Visits')
@ApiBearerAuth()
@Controller('visits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Start a new visit' })
  @ApiResponse({ status: 201, description: 'Visit created' })
  async createVisit(
    @Body() dto: CreateVisitDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.visitsService.createVisit(dto, user.id, tenant.id);
  }

  @Get()
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'List visits with filters' })
  @ApiResponse({ status: 200, description: 'Visits retrieved' })
  async findAll(@Query() query: VisitQueryDto) {
    return this.visitsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get visit details' })
  @ApiResponse({ status: 200, description: 'Visit details retrieved' })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async findOne(@Param('id') id: string) {
    return this.visitsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Update visit (auto-save)' })
  @ApiResponse({ status: 200, description: 'Visit updated' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVisitDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.visitsService.update(id, dto, user.id);
  }

  @Post(':id/sign')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Sign off visit' })
  @ApiResponse({ status: 200, description: 'Visit signed' })
  async signVisit(
    @Param('id') id: string,
    @Body() dto: SignVisitDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.visitsService.signVisit(id, dto, user.id);
  }

  @Post(':id/addendum')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Add addendum to signed visit' })
  @ApiResponse({ status: 200, description: 'Addendum added' })
  async addAddendum(
    @Param('id') id: string,
    @Body() dto: AddendumDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.visitsService.addAddendum(id, dto, user.id);
  }

  @Get(':id/versions')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get visit version history' })
  @ApiResponse({ status: 200, description: 'Version history retrieved' })
  async getVersions(@Param('id') id: string) {
    return this.visitsService.getVersions(id);
  }

  @Get(':id/procedure-notes')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get procedure notes for visit' })
  @ApiResponse({ status: 200, description: 'Procedure notes retrieved' })
  async getProcedureNotes(@Param('id') id: string) {
    return this.visitsService.getProcedureNotes(id);
  }

  @Post(':id/procedure-notes')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Add procedure note to visit' })
  @ApiResponse({ status: 201, description: 'Procedure note created' })
  async createProcedureNote(
    @Param('id') visitId: string,
    @Body() dto: ProcedureNoteDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.visitsService.createProcedureNote({ ...dto, visitId }, user.id, tenant.id);
  }

  @Patch('procedure-notes/:noteId')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update procedure note' })
  @ApiResponse({ status: 200, description: 'Procedure note updated' })
  async updateProcedureNote(
    @Param('noteId') noteId: string,
    @Body() dto: UpdateProcedureNoteDto,
  ) {
    return this.visitsService.updateProcedureNote(noteId, dto);
  }

  @Post('icd10/search')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Search ICD-10 codes' })
  @ApiResponse({ status: 200, description: 'ICD-10 codes retrieved' })
  async searchIcd10(@Body() dto: Icd10SearchDto) {
    return this.visitsService.searchIcd10(dto);
  }

  @Get('icd10/most-used')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get most used ICD-10 codes for doctor' })
  @ApiResponse({ status: 200, description: 'Most used codes retrieved' })
  async getMostUsedIcd10(
    @CurrentUser() user: { id: string },
    @Query('limit') limit?: number,
  ) {
    return this.visitsService.getMostUsedIcd10(user.id, limit ?? 10);
  }

  @Post('templates')
  @Roles(UserRole.ADMIN, UserRole.OWNER, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Create procedure template' })
  @ApiResponse({ status: 201, description: 'Template created' })
  async createTemplate(
    @Body() dto: CreateProcedureTemplateDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.visitsService.createProcedureTemplate(dto, tenant.id);
  }

  @Get('templates')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'List procedure templates' })
  @ApiResponse({ status: 200, description: 'Templates retrieved' })
  async getTemplates(
    @Query() query: ProcedureTemplateQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.visitsService.getProcedureTemplates(query, tenant.id);
  }

  @Patch('templates/:id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Update procedure template' })
  @ApiResponse({ status: 200, description: 'Template updated' })
  async updateTemplate(@Param('id') id: string, @Body() dto: UpdateProcedureTemplateDto) {
    return this.visitsService.updateProcedureTemplate(id, dto);
  }
}