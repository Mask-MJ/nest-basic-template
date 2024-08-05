import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from './common/validate/env.validation';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { SystemModule } from './modules/system/system.module';
import { ProjectModule } from './modules/project/project.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { IamModule } from './modules/iam/iam.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 10000, limit: 10 }]),
    ConfigModule.forRoot({ validate, isGlobal: true }),
    RouterModule.register([
      { path: 'project', module: ProjectModule },
      { path: 'system', module: SystemModule },
      { path: 'monitor', module: MonitorModule },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_DB'),
          autoLoadEntities: true,
          synchronize: true,
          logging: true,
          timezone: '+08:00',
          keepConnectionAlive: true,
        };
      },
      inject: [ConfigService],
    }),
    SystemModule,
    ProjectModule,
    MonitorModule,
    IamModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
