import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';

import jwtConfig from './config/jwt.config';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
// import { RolesGuard } from './authorization/guards/roles.guard';
import { PermissionsGuard } from './authorization/guards/permisssions.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/system/user/user.entity';
import { Role } from 'src/modules/system/role/role.entity';
import { Menu } from 'src/modules/system/menu/menu.entity';
import { Permission } from 'src/modules/system/menu/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Menu, Permission]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
    Logger,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
