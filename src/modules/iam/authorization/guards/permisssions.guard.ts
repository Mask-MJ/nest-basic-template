import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/modules/iam/iam.constants';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/system/user/user.entity';
import { Repository } from 'typeorm';
import { Permission } from 'src/modules/system/menu/permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const contextPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log(contextPermissions);
    if (!contextPermissions) return true;
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];

    const userInfo = await this.userRepository.findOne({
      where: { id: user.sub },
      relations: ['roles', 'roles.menus', 'roles.menus.permissions'],
    });
    if (!userInfo) return false;
    if (userInfo.isAdmin) return true;
    const permissionsName = userInfo.roles
      .reduce((acc, role) => acc.concat(role.menus), [] as any[])
      .reduce((acc, menu) => acc.concat(menu.permissions), [] as Permission[])
      .map((p: Permission) => p.value);

    return contextPermissions.every((permission) =>
      permissionsName.includes(permission),
    );
  }
}
