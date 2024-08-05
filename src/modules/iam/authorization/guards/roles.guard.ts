import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { REQUEST_USER_KEY } from 'src/modules/iam/iam.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/system/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const contextRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!contextRoles) return true;
    const request = context.switchToHttp().getRequest();
    const path: string = request.route.path;
    const user = request[REQUEST_USER_KEY];
    const userInfo = await this.userRepository.findOne({
      where: { id: user.sub },
      relations: ['role', 'role.menu'],
    });
    if (!userInfo) return false;
    return userInfo.roles.some((role) =>
      role.menus.some((menu) =>
        path.startsWith('/api/' + menu.path.split('/').pop()),
      ),
    );
  }
}
