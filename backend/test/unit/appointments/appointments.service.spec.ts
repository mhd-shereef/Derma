import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { AppointmentsService } from '@/modules/appointments/appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentQueryDto, SlotQueryDto } from '@/modules/appointments/dto';
import { AppointmentStatus, UserRole } from '@prisma/client';

const mockPrisma = {
  appointment: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an appointment with valid slot', async () => {
      const dto: CreateAppointmentDto = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        appointmentDate: '2024-01-20',
        startTime: '10:00',
        endTime: '10:30',
        procedureType: 'CO2 Laser',
      };

      mockPrisma.appointment.findFirst.mockResolvedValue(null);
      mockPrisma.appointment.create.mockResolvedValue({
        id: 'apt-1',
        ...dto,
        tenantId: 'tenant-1',
        createdBy: 'user-1',
        status: AppointmentStatus.BOOKED,
        checkInTime: null,
        cancellationReason: null,
        notes: null,
        appointmentDate: new Date(dto.appointmentDate),
        startTime: new Date(`2000-01-01T${dto.startTime}:00`),
        endTime: new Date(`2000-01-01T${dto.endTime}:00`),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await service.create(dto, 'user-1', 'tenant-1');

      expect(result.id).toBe('apt-1');
      expect(result.status).toBe(AppointmentStatus.BOOKED);
      expect(mockPrisma.appointment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId: 'tenant-1',
            patientId: 'patient-1',
            doctorId: 'doctor-1',
            createdBy: 'user-1',
          }),
        })
      );
    });

    it('should throw ConflictException for double booking', async () => {
      const dto: CreateAppointmentDto = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        appointmentDate: '2024-01-20',
        startTime: '10:00',
        endTime: '10:30',
      };

      mockPrisma.appointment.findFirst.mockResolvedValue({
        id: 'existing-apt',
        startTime: new Date('2000-01-01T10:00:00'),
        endTime: new Date('2000-01-01T10:30:00'),
      });

      await expect(service.create(dto, 'user-1', 'tenant-1')).rejects.toThrow('Time slot conflicts');
    });

    it('should throw BadRequestException for invalid time range', async () => {
      const dto: CreateAppointmentDto = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        appointmentDate: '2024-01-20',
        startTime: '10:30',
        endTime: '10:00',
      };

      await expect(service.create(dto, 'user-1', 'tenant-1')).rejects.toThrow('Start time must be before end time');
    });

    it('should throw BadRequestException for non-30-minute increments', async () => {
      const dto: CreateAppointmentDto = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        appointmentDate: '2024-01-20',
        startTime: '10:00',
        endTime: '10:45',
      };

      await expect(service.create(dto, 'user-1', 'tenant-1')).rejects.toThrow('30-minute increments');
    });

    it('should throw BadRequestException for outside clinic hours', async () => {
      const dto: CreateAppointmentDto = {
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        appointmentDate: '2024-01-20',
        startTime: '08:00',
        endTime: '08:30',
      };

      await expect(service.create(dto, 'user-1', 'tenant-1')).rejects.toThrow('between 9:00 and 19:00');
    });
  });

  describe('findAll', () => {
    it('should return paginated appointments with filters', async () => {
      const query: AppointmentQueryDto = {
        page: 1,
        perPage: 20,
        doctorId: 'doctor-1',
        status: AppointmentStatus.BOOKED,
      };

      const mockAppointments = [
        {
          id: 'apt-1',
          patientId: 'patient-1',
          doctorId: 'doctor-1',
          appointmentDate: new Date('2024-01-20'),
          startTime: new Date('2000-01-01T10:00:00'),
          endTime: new Date('2000-01-01T10:30:00'),
          status: AppointmentStatus.BOOKED,
          patient: { id: 'patient-1', patientNumber: 'PAT-001', firstName: 'John', lastName: 'Doe', phone: '+919876543210' },
          doctor: { id: 'doctor-1', firstName: 'Dr.', lastName: 'Smith', specialization: 'Dermatology' },
        },
      ];

      mockPrisma.appointment.findMany.mockResolvedValue(mockAppointments);
      mockPrisma.appointment.count.mockResolvedValue(1);

      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('checkIn', () => {
    it('should check in a booked appointment', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue({
        id: 'apt-1',
        status: AppointmentStatus.BOOKED,
        notes: null,
      });

      mockPrisma.appointment.update.mockResolvedValue({
        id: 'apt-1',
        status: AppointmentStatus.CHECKED_IN,
        checkInTime: new Date(),
      });

      const result = await service.checkIn('apt-1', { notes: 'Patient arrived' });

      expect(result.status).toBe(AppointmentStatus.CHECKED_IN);
      expect(result.checkInTime).toBeDefined();
    });

    it('should throw BadRequestException for already checked-in appointment', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue({
        id: 'apt-1',
        status: AppointmentStatus.CHECKED_IN,
      });

      await expect(service.checkIn('apt-1', {})).rejects.toThrow('Cannot check in appointment with status');
    });
  });

  describe('cancel', () => {
    it('should cancel an appointment', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue({
        id: 'apt-1',
        status: AppointmentStatus.BOOKED,
        notes: null,
      });

      mockPrisma.appointment.update.mockResolvedValue({
        id: 'apt-1',
        status: AppointmentStatus.CANCELLED,
        cancellationReason: 'Patient requested',
      });

      const result = await service.cancel('apt-1', { reason: 'Patient requested' }, 'user-1');

      expect(result.status).toBe(AppointmentStatus.CANCELLED);
      expect(result.cancellationReason).toBe('Patient requested');
    });

    it('should throw BadRequestException for completed appointment', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue({
        id: 'apt-1',
        status: AppointmentStatus.COMPLETED,
      });

      await expect(service.cancel('apt-1', { reason: 'Test' }, 'user-1')).rejects.toThrow('Cannot cancel completed appointment');
    });
  });

  describe('getAvailableSlots', () => {
    it('should return available slots for a doctor', async () => {
      const query: SlotQueryDto = {
        doctorId: 'doctor-1',
        date: '2024-01-20',
      };

      mockPrisma.user.findUnique.mockResolvedValue({ id: 'doctor-1', tenantId: 'tenant-1' });
      mockPrisma.appointment.findMany.mockResolvedValue([]);

      const slots = await service.getAvailableSlots(query);

      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0]).toHaveProperty('startTime');
      expect(slots[0]).toHaveProperty('endTime');
      expect(slots[0]).toHaveProperty('isAvailable');
    });

    it('should mark booked slots as unavailable', async () => {
      const query: SlotQueryDto = {
        doctorId: 'doctor-1',
        date: '2024-01-20',
      };

      mockPrisma.user.findUnique.mockResolvedValue({ id: 'doctor-1', tenantId: 'tenant-1' });
      mockPrisma.appointment.findMany.mockResolvedValue([
        { startTime: new Date('2000-01-01T10:00:00'), endTime: new Date('2000-01-01T10:30:00') },
      ]);

      const slots = await service.getAvailableSlots(query);

      const bookedSlot = slots.find(s => s.startTime === '10:00');
      expect(bookedSlot?.isAvailable).toBe(false);
    });
  });

  describe('reorderQueue', () => {
    it('should reorder queue appointments', async () => {
      mockPrisma.appointment.findMany.mockResolvedValue([
        { id: 'apt-1', status: AppointmentStatus.CHECKED_IN },
        { id: 'apt-2', status: AppointmentStatus.IN_PROGRESS },
      ]);

      mockPrisma.appointment.findUnique
        .mockResolvedValueOnce({ id: 'apt-1', notes: null })
        .mockResolvedValueOnce({ id: 'apt-2', notes: null });

      mockPrisma.appointment.update
        .mockResolvedValueOnce({ id: 'apt-1' })
        .mockResolvedValueOnce({ id: 'apt-2' });

      await service.reorderQueue(['apt-2', 'apt-1'], 'tenant-1');

      expect(mockPrisma.appointment.update).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException for invalid appointments', async () => {
      mockPrisma.appointment.findMany.mockResolvedValue([]);

      await expect(service.reorderQueue(['apt-1'], 'tenant-1')).rejects.toThrow('Some appointments not found');
    });
  });
});