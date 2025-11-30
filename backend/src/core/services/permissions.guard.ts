import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RolePermission } from '../entities/role-permission.entity';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'change_me',
      });
      request.user = payload;
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
      }
      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
        relations: ['userRoles', 'userRoles.role', 'userRoles.role.rolePermissions', 'userRoles.role.rolePermissions.permission'],
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const userPermissions = new Set<string>();
      user.userRoles?.forEach((ur) => {
        ur.role?.rolePermissions?.forEach((rp) => {
          if (rp.permission?.code) {
            userPermissions.add(rp.permission.code);
          }
        });
      });
      const hasPermission = requiredPermissions.every((perm) => userPermissions.has(perm));
      if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions');
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
