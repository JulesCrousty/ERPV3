import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { UserRole } from '../entities/user-role.entity';
import { RolePermission } from '../entities/role-permission.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionsRepository: Repository<RolePermission>,
  ) {}

  async onModuleInit() {
    const usersCount = await this.usersRepository.count();
    if (usersCount === 0) {
      const adminRole = await this.rolesRepository.save({ name: 'Administrator', code: 'ADMIN' });
      const permissionsCodes = [
        'core.users.read',
        'core.users.write',
        'test.items.read',
        'test.items.write',
      ];
      const permissions = await Promise.all(
        permissionsCodes.map((code) => this.permissionsRepository.save({ code })),
      );
      for (const permission of permissions) {
        await this.rolePermissionsRepository.save({ role: adminRole, permission });
      }
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = await this.usersRepository.save({
        email: 'admin@erpv3.local',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
      });
      await this.userRolesRepository.save({ user: adminUser, role: adminRole });
      console.log('Seeded default admin user admin@erpv3.local with password admin123');
    }
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(user);
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      for (const roleId of createUserDto.roleIds) {
        const role = await this.rolesRepository.findOne({ where: { id: roleId } });
        if (role) {
          await this.userRolesRepository.save({ user: savedUser, role });
        }
      }
    }
    return this.findOne(savedUser.id);
  }

  findAll() {
    return this.usersRepository.find({
      relations: ['userRoles', 'userRoles.role', 'userRoles.role.rolePermissions', 'userRoles.role.rolePermissions.permission'],
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role', 'userRoles.role.rolePermissions', 'userRoles.role.rolePermissions.permission'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.usersRepository.update({ id }, updateUserDto);
    if (updateUserDto.roleIds) {
      await this.userRolesRepository.delete({ user: { id } as any });
      for (const roleId of updateUserDto.roleIds) {
        const role = await this.rolesRepository.findOne({ where: { id: roleId } });
        if (role) {
          await this.userRolesRepository.save({ user, role });
        }
      }
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.usersRepository.delete(id);
    return { deleted: true };
  }
}
