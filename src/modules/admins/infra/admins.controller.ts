import {
  BadRequestException,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Body,
  Query,
} from '@nestjs/common';
import {
  AdminUserUseCasesImpl,
  AdminEmailAlreadyExistsError,
  AdminNotFoundError,
} from '../use-case/AdminUserUseCasesImpl';
import type {
  CreateAdminUserDTO,
  UpdateAdminUserDTO,
  AdminUserResponseDTO,
} from '../interface/AdminUserDTOs';
import type { PaginatedResult } from '../use-case/AdminUserUseCases';

interface ListAdminsQueryHttp {
  page?: string;
  pageSize?: string;
  isActive?: string;
  email?: string;
}

@Controller('v1/admins')
export class AdminUserController {
  constructor(private readonly useCases: AdminUserUseCasesImpl) {}

  @Post()
  async create(
    @Body() body: CreateAdminUserDTO,
  ): Promise<AdminUserResponseDTO> {
    try {
      return await this.useCases.createAdminUser(body);
    } catch (error) {
      if (error instanceof AdminEmailAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<AdminUserResponseDTO> {
    const admin = await this.useCases.getAdminUserById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  @Get()
  async list(
    @Query() query: ListAdminsQueryHttp,
  ): Promise<PaginatedResult<AdminUserResponseDTO>> {
    const page =
      typeof query.page === 'string' ? Number(query.page) : undefined;
    const pageSize =
      typeof query.pageSize === 'string' ? Number(query.pageSize) : undefined;

    let isActive: boolean | undefined;
    if (typeof query.isActive === 'string') {
      if (query.isActive.toLowerCase() === 'true') {
        isActive = true;
      } else if (query.isActive.toLowerCase() === 'false') {
        isActive = false;
      }
    }

    const email = query.email;

    return this.useCases.listAdminUsers({
      page,
      pageSize,
      isActive,
      email,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAdminUserDTO,
  ): Promise<AdminUserResponseDTO> {
    try {
      const updated = await this.useCases.updateAdminUser(id, body);
      if (!updated) {
        throw new NotFoundException('Admin not found');
      }
      return updated;
    } catch (error) {
      if (error instanceof AdminEmailAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.useCases.deleteAdminUser(id);
    } catch (error) {
      if (error instanceof AdminNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
