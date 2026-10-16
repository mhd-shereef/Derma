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
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentQueryDto,
  CheckInDto,
  CancelAppointmentDto,
  SlotQueryDto,
} from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { CurrentTenant } from '@/common/decorators/current-tenant.decorator';
import { UserRole, AppointmentStatus } from '@prisma/client';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Book a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment booked successfully' })
  @ApiResponse({ status: 409, description: 'Time slot already booked' })
  async create(
    @Body() dto: CreateAppointmentDto,
    @CurrentUser() user: { id: string },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.appointmentsService.create(dto, user.id, tenant.id);
  }

  @Get()
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'List appointments with filters' })
  @ApiResponse({ status: 200, description: 'Appointments retrieved' })
  async findAll(@Query() query: AppointmentQueryDto) {
    return this.appointmentsService.findAll(query);
  }

  @Get('queue')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get current queue (checked-in patients)' })
  @ApiResponse({ status: 200, description: 'Queue retrieved' })
  async getQueue(
    @Query('doctorId') doctorId?: string,
    @Query('date') date?: string,
    @CurrentTenant() tenant?: { id: string },
  ) {
    return this.appointmentsService.getQueue(doctorId, date, tenant?.id);
  }

  @Get('calendar')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get calendar view for a doctor' })
  @ApiResponse({ status: 200, description: 'Calendar appointments retrieved' })
  async getCalendar(
    @Query('doctorId') doctorId: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.appointmentsService.getCalendar(doctorId, from, to, tenant.id);
  }

  @Get('slots')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Get available time slots for a doctor' })
  @ApiResponse({ status: 200, description: 'Available slots retrieved' })
  async getSlots(@Query() query: SlotQueryDto) {
    return this.appointmentsService.getAvailableSlots(query);
  }

  @Get(':id')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER, UserRole.DOCTOR, UserRole.NURSE)
  @ApiOperation({ summary: 'Get appointment details' })
  @ApiResponse({ status: 200, description: 'Appointment details retrieved' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Update appointment' })
  @ApiResponse({ status: 200, description: 'Appointment updated' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @ApiResponse({ status: 409, description: 'Time slot conflict' })
  async update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, dto);
  }

  @Post(':id/check-in')
  @Roles(UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Check in patient' })
  @ApiResponse({ status: 200, description: 'Patient checked in' })
  @ApiResponse({ status: 400, description: 'Invalid status for check-in' })
  async checkIn(@Param('id') id: string, @Body() dto: CheckInDto) {
    return this.appointmentsService.checkIn(id, dto);
  }

  @Post(':id/cancel')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Cancel appointment' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled' })
  @ApiResponse({ status: 400, description: 'Cannot cancel completed appointment' })
  async cancel(
    @Param('id') id: string,
    @Body() dto: CancelAppointmentDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.appointmentsService.cancel(id, dto, user.id);
  }

  @Post('queue/reorder')
  @Roles(UserRole.RECEPTIONIST, UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({ summary: 'Reorder queue' })
  @ApiResponse({ status: 200, description: 'Queue reordered' })
  async reorderQueue(
    @Body() body: { appointmentIds: string[] },
    @CurrentTenant() tenant: { id: string },
  ) {
    return this.appointmentsService.reorderQueue(body.appointmentIds, tenant.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete appointment' })
  @ApiResponse({ status: 200, description: 'Appointment deleted' })
  async softDelete(@Param('id') id: string) {
    return this.appointmentsService.softDelete(id);
  }
}