import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../entities/role.entity';
import { RolePermission } from '../entities/role-permission.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role', 'userRoles.role.rolePermissions', 'userRoles.role.rolePermissions.permission'],
    });
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'change_me',
      expiresIn: '1d',
    });
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        roles: user.userRoles?.map((ur) => ur.role?.code) || [],
        permissions:
          user.userRoles?.flatMap((ur) => ur.role?.rolePermissions?.map((rp) => rp.permission?.code) || []) || [],
      },
    };
  }
}
