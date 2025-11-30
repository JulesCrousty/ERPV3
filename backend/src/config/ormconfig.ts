import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../core/entities/user.entity';
import { Role } from '../core/entities/role.entity';
import { Permission } from '../core/entities/permission.entity';
import { UserRole } from '../core/entities/user-role.entity';
import { RolePermission } from '../core/entities/role-permission.entity';
import { TestItem } from '../testmodule/entities/test-item.entity';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'erpv3',
  password: process.env.DB_PASSWORD || 'erpv3',
  database: process.env.DB_NAME || 'erpv3',
  entities: [User, Role, Permission, UserRole, RolePermission, TestItem],
  synchronize: true,
};
