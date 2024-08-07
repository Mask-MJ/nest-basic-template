import { DeptController } from './dept/dept.controller';
import { DeptService } from './dept/dept.service';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { MenuController } from './menu/menu.controller';
import { MenuService } from './menu/menu.service';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

export const systemControllers = [
  DeptController,
  RoleController,
  MenuController,
  PostController,
  UserController,
];

export const systemProviders = [
  DeptService,
  RoleService,
  MenuService,
  PostService,
  UserService,
];
