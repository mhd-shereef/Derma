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
import { PhotosService } from './photos.service';
import {
  GetUploadUrlDto,
  CreatePhotoDto,
  UpdatePhotoDto,
  PhotoQueryDto,
  AnnotationDto,
  PhotoComparisonQueryDto,
} from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CurrentTenant } from '@/common/decorators/current-tenant.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Photos')
@ApiBearerAuth()
@Controller('photos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload-url')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get pre-signed upload URL' })
  @ApiResponse({ status: 200, description: 'Upload URL generated' })
  async getUploadUrl(
    @Body() dto: GetUploadUrlDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.photosService.getUploadUrl(dto, user.id, tenant.id);
  }

  @Post()
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Register uploaded photo metadata' })
  @ApiResponse({ status: 201, description: 'Photo registered' })
  async create(
    @Body() dto: CreatePhotoDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.photosService.registerPhoto(dto, user.id, tenant.id);
  }

  @Get('patient/:patientId')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get all photos for a patient' })
  @ApiResponse({ status: 200, description: 'Photos retrieved' })
  async findByPatient(
    @Param('patientId') patientId: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.photosService.findByPatient(patientId, tenant.id);
  }

  @Get()
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'List photos with filters' })
  @ApiResponse({ status: 200, description: 'Photos retrieved' })
  async findAll(
    @Query() query: PhotoQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.photosService.findAll(query, tenant.id);
  }

  @Get(':id')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get photo with signed view URL' })
  @ApiResponse({ status: 200, description: 'Photo details with signed URL' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.photosService.getSignedViewUrl(id, user.id, tenant.id);
  }

  @Patch(':id')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Update photo metadata' })
  @ApiResponse({ status: 200, description: 'Photo updated' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePhotoDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.photosService.updatePhoto(id, dto, tenant.id);
  }

  @Post(':id/annotations')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Add annotation to photo' })
  @ApiResponse({ status: 200, description: 'Annotation added' })
  async addAnnotation(
    @Param('id') id: string,
    @Body() dto: AnnotationDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.photosService.addAnnotation(id, dto, tenant.id);
  }

  @Get('patient/:patientId/compare')
  @Roles(UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get before/after comparison photos' })
  @ApiResponse({ status: 200, description: 'Comparison photos retrieved' })
  async getComparison(
    @Param('patientId') patientId: string,
    @Query() query: PhotoComparisonQueryDto,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.photosService.getComparison({ ...query, patientId }, tenant.id);
  }

  @Get(':id/access-log')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get photo access log' })
  @ApiResponse({ status: 200, description: 'Access log retrieved' })
  async getAccessLog(
    @Param('id') id: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.photosService.getAccessLog(id, tenant.id);
  }

  @Delete(':id')
  @Roles(UserRole.DOCTOR, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Soft delete photo' })
  @ApiResponse({ status: 200, description: 'Photo deleted' })
  async softDelete(
    @Param('id') id: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.photosService.softDelete(id, tenant.id);
  }
}