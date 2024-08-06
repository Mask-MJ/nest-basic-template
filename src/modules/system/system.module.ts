import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { User } from './user/user.entity';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { Role } from './role/role.entity';
import { BcryptService } from '../iam/hashing/bcrypt.service';
import { HashingService } from '../iam/hashing/hashing.service';
import { PostModule } from './post/post.module';
import { DeptModule } from './dept/dept.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    RoleModule,
    MenuModule,
    PostModule,
    DeptModule,
  ],
  controllers: [UserController],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    UserService,
  ],
})
export class SystemModule {}
