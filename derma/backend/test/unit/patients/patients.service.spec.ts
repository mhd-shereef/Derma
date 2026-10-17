import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { PatientsService } from '@/modules/patients/patients.service';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto, CheckDuplicateDto } from '@/modules/patients/dto';
import { PatientGender, UserRole } from '@prisma/client';

interface MockPrisma {
  patient: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
    count: jest.Mock;
  };
  visitVersion: {
    count: jest.Mock;
    create: jest.Mock;
  };
  $transaction: jest.Mock;
}

const createMockPrisma = (): MockPrisma => ({
  patient: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  visitVersion: {
    count: jest.fn(),
    create: jest.fn(),
  },
  $transaction: jest.fn(async (fn: (tx: MockPrisma) => Promise<unknown>) => fn(mockPrisma)),
});

let mockPrisma: MockPrisma;

describe('PatientsService', () => {
  let service: PatientsService;

  beforeEach(async () => {
    mockPrisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a patient with generated patient number', async () => {
      const dto: CreatePatientDto = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+919876543210',
        email: 'john@example.com',
      };

      mockPrisma.patient.findFirst.mockResolvedValue(null);
      mockPrisma.patient.create.mockResolvedValue({
        id: 'patient-1',
        patientNumber: 'PAT-0001',
        ...dto,
        tenantId: 'tenant-1',
        createdBy: 'user-1',
        dateOfBirth: null,
        gender: null,
        address: null,
        emergencyContact: null,
        bloodGroup: null,
        allergies: [],
        medicalHistory: null,
        notes: null,
        profilePhotoKey: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await service.create(dto, 'user-1', 'tenant-1');

      expect(result.patientNumber).toBe('PAT-0001');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(mockPrisma.patient.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId: 'tenant-1',
            patientNumber: 'PAT-0001',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+919876543210',
            createdBy: 'user-1',
          }),
        })
      );
    });

    it('should generate sequential patient numbers', async () => {
      const dto: CreatePatientDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+919876543211',
      };

      mockPrisma.patient.findFirst.mockResolvedValue({ patientNumber: 'PAT-0042' });
      mockPrisma.patient.create.mockResolvedValue({
        id: 'patient-2',
        patientNumber: 'PAT-0043',
        ...dto,
        tenantId: 'tenant-1',
        createdBy: 'user-1',
        dateOfBirth: null,
        gender: null,
        address: null,
        emergencyContact: null,
        bloodGroup: null,
        allergies: [],
        medicalHistory: null,
        notes: null,
        profilePhotoKey: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await service.create(dto, 'user-1', 'tenant-1');

      expect(result.patientNumber).toBe('PAT-0043');
    });
  });

  describe('findAll', () => {
    it('should return paginated patients with filters', async () => {
      const query: PatientQueryDto = {
        page: 1,
        perPage: 20,
        search: 'John',
      };

      const mockPatients = [
        {
          id: 'p1',
          patientNumber: 'PAT-0001',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+919876543210',
          email: 'john@example.com',
          gender: PatientGender.MALE,
          dateOfBirth: new Date('1990-01-01'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.patient.findMany.mockResolvedValue(mockPatients);
      mockPrisma.patient.count.mockResolvedValue(1);

      const result = await service.findAll(query);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(mockPrisma.patient.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deletedAt: null,
            OR: expect.arrayContaining([
              expect.objectContaining({ firstName: { contains: 'John', mode: 'insensitive' } }),
            ]),
          }),
        })
      );
    });
  });

  describe('checkDuplicate', () => {
    it('should find potential duplicates by name and phone', async () => {
      const dto: CheckDuplicateDto = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+919876543210',
        dateOfBirth: '1990-01-01',
      };

      mockPrisma.patient.findMany.mockResolvedValue([
        {
          id: 'p1',
          patientNumber: 'PAT-0001',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+919876543210',
          dateOfBirth: new Date('1990-01-01'),
        },
      ]);

      const results = await service.checkDuplicate(dto);

      expect(results).toHaveLength(1);
      expect(results[0].similarityScore).toBe(100);
      expect(results[0].patientNumber).toBe('PAT-0001');
    });

    it('should return empty array when no duplicates found', async () => {
      const dto: CheckDuplicateDto = {
        firstName: 'Unique',
        lastName: 'Name',
        phone: '+919999999999',
      };

      mockPrisma.patient.findMany.mockResolvedValue([]);

      const results = await service.checkDuplicate(dto);

      expect(results).toHaveLength(0);
    });

    it('should sort duplicates by similarity score descending', async () => {
      const dto: CheckDuplicateDto = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+919876543210',
      };

      mockPrisma.patient.findMany.mockResolvedValue([
        {
          id: 'p1',
          patientNumber: 'PAT-0001',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+919876543210',
          dateOfBirth: new Date('1990-01-01'),
        },
        {
          id: 'p2',
          patientNumber: 'PAT-0002',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+919876543211',
          dateOfBirth: null,
        },
      ]);

      const results = await service.checkDuplicate(dto);

      expect(results).toHaveLength(2);
      expect(results[0].similarityScore).toBeGreaterThanOrEqual(results[1].similarityScore);
    });
  });

  describe('searchByNameOrPhone', () => {
    it('should return empty array for search term less than 2 characters', async () => {
      const results = await service.searchByNameOrPhone('J');
      expect(results).toEqual([]);
    });

    it('should search by name, phone, and patient number', async () => {
      mockPrisma.patient.findMany.mockResolvedValue([
        { id: 'p1', patientNumber: 'PAT-0001', firstName: 'John', lastName: 'Doe', phone: '+919876543210' },
      ]);

      const results = await service.searchByNameOrPhone('John');

      expect(results).toHaveLength(1);
      expect(mockPrisma.patient.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deletedAt: null,
            OR: expect.arrayContaining([
              expect.objectContaining({ firstName: { contains: 'John', mode: 'insensitive' } }),
              expect.objectContaining({ phone: { contains: 'John' } }),
            ]),
          }),
        })
      );
    });
  });

  describe('generatePatientNumber', () => {
    it('should return PAT-0001 for first patient', async () => {
      mockPrisma.patient.findFirst.mockResolvedValue(null);

      const result = await (service as any).generatePatientNumber();

      expect(result).toBe('PAT-0001');
    });

    it('should increment patient number sequentially', async () => {
      mockPrisma.patient.findFirst.mockResolvedValue({ patientNumber: 'PAT-0999' });

      const result = await (service as any).generatePatientNumber();

      expect(result).toBe('PAT-1000');
    });
  });
});