import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { AuthenticatedUser } from '../../common/types/request.types';

const SALT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, page = 1, perPage = 20) {
    const skip = (page - 1) * perPage;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { tenantId, deletedAt: null },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          licenseNumber: true,
          specialization: true,
          isActive: true,
          mfaEnabled: true,
          lastLoginAt: true,
          createdAt: true,
        },
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { tenantId, deletedAt: null } }),
    ]);

    return {
      data: users,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findById(tenantId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, tenantId, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        licenseNumber: true,
        specialization: true,
        isActive: true,
        mfaEnabled: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(tenantId: string, actor: AuthenticatedUser, data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string;
    licenseNumber?: string;
    specialization?: string;
  }) {
    if (actor.role !== 'OWNER' && actor.role !== 'ADMIN') {
      throw new ForbiddenException('Insufficient permissions to create staff');
    }

    if (actor.role === 'ADMIN' && data.role === 'OWNER') {
      throw new ForbiddenException('Admins cannot create owner accounts');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { tenantId, email: data.email, deletedAt: null },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        specialization: data.specialization,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        licenseNumber: true,
        specialization: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async update(tenantId: string, id: string, actor: AuthenticatedUser, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    licenseNumber?: string;
    specialization?: string;
    isActive?: boolean;
    role?: 'OWNER' | 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST';
  }) {
    const targetUser = await this.findById(tenantId, id);

    if (actor.id === id) {
      if (data.isActive === false) {
        throw new ForbiddenException('Cannot deactivate your own account');
      }
    }

    if (actor.role !== 'OWNER') {
      if (targetUser.role === 'OWNER') {
        throw new ForbiddenException('Cannot modify owner account');
      }
      if (data.role && data.role === 'OWNER') {
        throw new ForbiddenException('Only owners can assign owner role');
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        specialization: data.specialization,
        isActive: data.isActive,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        licenseNumber: true,
        specialization: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async changeRole(tenantId: string, id: string, actor: AuthenticatedUser, role: UserRole) {
    if (actor.role !== 'OWNER') {
      throw new ForbiddenException('Only owners can change roles');
    }

    const targetUser = await this.findById(tenantId, id);

    if (targetUser.role === 'OWNER') {
      throw new ForbiddenException('Cannot change owner role');
    }

    if (role === 'OWNER') {
      throw new ForbiddenException('Cannot assign owner role via this endpoint');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async deactivate(tenantId: string, id: string, actor: AuthenticatedUser) {
    if (actor.id === id) {
      throw new ForbiddenException('Cannot deactivate your own account');
    }

    const targetUser = await this.findById(tenantId, id);

    if (targetUser.role === 'OWNER') {
      throw new ForbiddenException('Cannot deactivate owner account');
    }

    if (actor.role !== 'OWNER' && targetUser.role === 'ADMIN') {
      throw new ForbiddenException('Only owners can deactivate admins');
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    });

    return { success: true };
  }
}