import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Role } from './role/role.entity';
import { BcryptService } from '../iam/hashing/bcrypt.service';
import { HashingService } from '../iam/hashing/hashing.service';
import { systemControllers, systemProviders } from './index';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [...systemControllers],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    ...systemProviders,
  ],
})
export class SystemModule {}
