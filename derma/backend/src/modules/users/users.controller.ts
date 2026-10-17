import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { UserRole } from '@prisma/client';
import { AuthenticatedUser } from '../../common/types/request.types';
import { TenantContext } from '../../common/types/request.types';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Users (Staff)')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'List all staff members' })
  @ApiResponse({ status: 200, description: 'List of staff members' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  async findAll(
    @CurrentTenant() tenant: TenantContext,
    @Query() pagination: PaginationDto,
  ) {
    return this.usersService.findAll(tenant.id, pagination.page, pagination.perPage);
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new staff account' })
  @ApiResponse({ status: 201, description: 'Staff created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async create(
    @CurrentTenant() tenant: TenantContext,
    @CurrentUser() actor: AuthenticatedUser,
    @Body() data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      phone?: string;
      licenseNumber?: string;
      specialization?: string;
    },
  ) {
    return this.usersService.create(tenant.id, actor, data);
  }

  @Get(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get staff member details' })
  @ApiResponse({ status: 200, description: 'Staff details' })
  @ApiResponse({ status: 404, description: 'Staff not found' })
  async findById(
    @CurrentTenant() tenant: TenantContext,
    @Param('id') id: string,
  ) {
    return this.usersService.findById(tenant.id, id);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update staff member' })
  @ApiResponse({ status: 200, description: 'Staff updated successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async update(
    @CurrentTenant() tenant: TenantContext,
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      licenseNumber?: string;
      specialization?: string;
      isActive?: boolean;
    },
  ) {
    return this.usersService.update(tenant.id, id, actor, data);
  }

  @Patch(':id/role')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Change staff role (Owner only)' })
  @ApiResponse({ status: 200, description: 'Role changed successfully' })
  @ApiResponse({ status: 403, description: 'Only owners can change roles' })
  async changeRole(
    @CurrentTenant() tenant: TenantContext,
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ) {
    return this.usersService.changeRole(tenant.id, id, actor, role);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Deactivate staff member' })
  @ApiResponse({ status: 200, description: 'Staff deactivated successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async deactivate(
    @CurrentTenant() tenant: TenantContext,
    @CurrentUser() actor: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.usersService.deactivate(tenant.id, id, actor);
  }
}