import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { User } from './user/user.entity';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, MenuModule],
  controllers: [UserController],
  providers: [UserService],
})
export class SystemModule {}
