import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, AppointmentStatus } from '@prisma/client';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentQueryDto,
  CheckInDto,
  CancelAppointmentDto,
  SlotQueryDto,
  AvailableSlot,
} from './dto';

const APPOINTMENT_DURATION_MINUTES = 30;
const CLINIC_START_HOUR = 9;
const CLINIC_END_HOUR = 19;

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto, createdBy: string, tenantId: string) {
    await this.validateSlot(dto.doctorId, dto.appointmentDate, dto.startTime, dto.endTime, tenantId);

    const data: Prisma.AppointmentUncheckedCreateInput = {
      tenantId,
      patientId: dto.patientId,
      doctorId: dto.doctorId,
      appointmentDate: new Date(dto.appointmentDate),
      startTime: new Date(`2000-01-01T${dto.startTime}:00`),
      endTime: new Date(`2000-01-01T${dto.endTime}:00`),
      procedureType: dto.procedureType,
      status: AppointmentStatus.BOOKED,
      notes: dto.notes,
      createdBy,
    };

    return this.prisma.appointment.create({ data });
  }

  async findAll(query: AppointmentQueryDto) {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 20;
    const sortBy = query.sortBy ?? 'appointmentDate';
    const sortOrder = query.sortOrder ?? 'asc';

    const where: Prisma.AppointmentWhereInput = {
      deletedAt: null,
    };

    if (query.patientId) where.patientId = query.patientId;
    if (query.doctorId) where.doctorId = query.doctorId;
    if (query.status) where.status = query.status;
    if (query.from || query.to) {
      where.appointmentDate = {};
      if (query.from) where.appointmentDate.gte = new Date(query.from);
      if (query.to) where.appointmentDate.lte = new Date(query.to);
    }
    if (query.search) {
      where.OR = [
        { procedureType: { contains: query.search, mode: 'insensitive' } },
        { notes: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          patient: {
            select: { id: true, patientNumber: true, firstName: true, lastName: true, phone: true },
          },
          doctor: {
            select: { id: true, firstName: true, lastName: true, specialization: true },
          },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id, deletedAt: null },
      include: {
        patient: true,
        doctor: {
          select: { id: true, firstName: true, lastName: true, licenseNumber: true, specialization: true },
        },
        visit: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id, deletedAt: null },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === AppointmentStatus.COMPLETED || appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Cannot update completed or cancelled appointment');
    }

    if (dto.doctorId || dto.appointmentDate || dto.startTime || dto.endTime) {
      const doctorId = dto.doctorId ?? appointment.doctorId;
      const appointmentDate = dto.appointmentDate ?? appointment.appointmentDate.toISOString().split('T')[0];
      const startTime = dto.startTime ?? appointment.startTime.toISOString().substr(11, 5);
      const endTime = dto.endTime ?? appointment.endTime.toISOString().substr(11, 5);

      await this.validateSlot(doctorId, appointmentDate, startTime, endTime, appointment.tenantId, id);
    }

    const updateData: Prisma.AppointmentUpdateInput = {};

    if (dto.patientId !== undefined) updateData.patient = { connect: { id: dto.patientId } };
    if (dto.doctorId !== undefined) updateData.doctor = { connect: { id: dto.doctorId } };
    if (dto.appointmentDate !== undefined) updateData.appointmentDate = new Date(dto.appointmentDate);
    if (dto.startTime !== undefined) updateData.startTime = new Date(`2000-01-01T${dto.startTime}:00`);
    if (dto.endTime !== undefined) updateData.endTime = new Date(`2000-01-01T${dto.endTime}:00`);
    if (dto.procedureType !== undefined) updateData.procedureType = dto.procedureType;
    if (dto.notes !== undefined) updateData.notes = dto.notes;

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: { select: { id: true, patientNumber: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async checkIn(id: string, dto: CheckInDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id, deletedAt: null },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status !== AppointmentStatus.BOOKED && appointment.status !== AppointmentStatus.CONFIRMED) {
      throw new BadRequestException(`Cannot check in appointment with status: ${appointment.status}`);
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CHECKED_IN,
        checkInTime: new Date(),
        notes: dto.notes ? `${appointment.notes ?? ''}\nCheck-in: ${dto.notes}`.trim() : appointment.notes,
      },
      include: {
        patient: { select: { id: true, patientNumber: true, firstName: true, lastName: true } },
      },
    });
  }

  async cancel(id: string, dto: CancelAppointmentDto, cancelledBy: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id, deletedAt: null },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed appointment');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
        cancellationReason: dto.reason,
        notes: `${appointment.notes ?? ''}\nCancelled by ${cancelledBy}: ${dto.reason}`.trim(),
      },
    });
  }

  async getQueue(doctorId?: string, date?: string, tenantId?: string) {
    const where: Prisma.AppointmentWhereInput = {
      deletedAt: null,
      status: { in: [AppointmentStatus.CHECKED_IN, AppointmentStatus.IN_PROGRESS] },
    };

    if (doctorId) where.doctorId = doctorId;
    if (date) {
      where.appointmentDate = new Date(date);
    }
    if (tenantId) where.tenantId = tenantId;

    return this.prisma.appointment.findMany({
      where,
      orderBy: [{ status: 'asc' }, { checkInTime: 'asc' }],
      include: {
        patient: {
          select: { id: true, patientNumber: true, firstName: true, lastName: true, phone: true },
        },
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async getCalendar(doctorId: string, from: string, to: string, tenantId: string) {
    return this.prisma.appointment.findMany({
      where: {
        deletedAt: null,
        doctorId,
        tenantId,
        appointmentDate: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      orderBy: { appointmentDate: 'asc' },
      include: {
        patient: { select: { id: true, patientNumber: true, firstName: true, lastName: true } },
      },
    });
  }

  async getAvailableSlots(query: SlotQueryDto): Promise<AvailableSlot[]> {
    const { doctorId, date, startTime, endTime } = query;

    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId },
      select: { id: true, tenantId: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const targetDate = new Date(date);
    const dayStart = startTime ? new Date(`2000-01-01T${startTime}:00`) : new Date(`2000-01-01T${CLINIC_START_HOUR}:00`);
    const dayEnd = endTime ? new Date(`2000-01-01T${endTime}:00`) : new Date(`2000-01-01T${CLINIC_END_HOUR}:00`);

    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        deletedAt: null,
        doctorId,
        tenantId: doctor.tenantId,
        appointmentDate: targetDate,
        status: { notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] },
      },
      select: { startTime: true, endTime: true },
    });

    const slots: AvailableSlot[] = [];
    let current = new Date(dayStart);

    while (current < dayEnd) {
      const slotEnd = new Date(current.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);
      if (slotEnd > dayEnd) break;

      const isBooked = existingAppointments.some((apt) => {
        const aptStart = apt.startTime;
        const aptEnd = apt.endTime;
        return current < aptEnd && slotEnd > aptStart;
      });

      slots.push({
        startTime: current.toISOString().substr(11, 5),
        endTime: slotEnd.toISOString().substr(11, 5),
        isAvailable: !isBooked,
      });

      current = slotEnd;
    }

    return slots;
  }

  async reorderQueue(appointmentIds: string[], tenantId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        id: { in: appointmentIds },
        tenantId,
        deletedAt: null,
        status: { in: [AppointmentStatus.CHECKED_IN, AppointmentStatus.IN_PROGRESS] },
      },
    });

    if (appointments.length !== appointmentIds.length) {
      throw new BadRequestException('Some appointments not found or not in queue');
    }

    const updates = appointmentIds.map(async (id, index) => {
      const apt = await this.prisma.appointment.findUnique({ where: { id } });
      return this.prisma.appointment.update({
        where: { id },
        data: { notes: `${apt?.notes ?? ''}\nQueue position: ${index + 1}`.trim() },
      });
    });

    return Promise.all(updates);
  }

  async softDelete(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id, deletedAt: null },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async validateSlot(
    doctorId: string,
    appointmentDate: string,
    startTime: string,
    endTime: string,
    tenantId: string,
    excludeId?: string
  ) {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);

    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }

    const durationMinutes = (end.getTime() - start.getTime()) / 60000;
    if (durationMinutes % APPOINTMENT_DURATION_MINUTES !== 0) {
      throw new BadRequestException(`Appointment duration must be in ${APPOINTMENT_DURATION_MINUTES}-minute increments`);
    }

    if (start.getHours() < CLINIC_START_HOUR || end.getHours() > CLINIC_END_HOUR) {
      throw new BadRequestException(`Appointments must be between ${CLINIC_START_HOUR}:00 and ${CLINIC_END_HOUR}:00`);
    }

    const where: Prisma.AppointmentWhereInput = {
      deletedAt: null,
      doctorId,
      tenantId,
      appointmentDate: new Date(appointmentDate),
      status: { notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW] },
      AND: [
        { startTime: { lt: end } },
        { endTime: { gt: start } },
      ],
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const conflict = await this.prisma.appointment.findFirst({ where });

    if (conflict) {
      throw new ConflictException(
        `Time slot conflicts with existing appointment (${conflict.startTime.toISOString().substr(11, 5)}-${conflict.endTime.toISOString().substr(11, 5)})`
      );
    }
  }
}