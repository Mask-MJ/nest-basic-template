import { Module } from '@nestjs/common';
import { LoginLogController } from './login-log/login-log.controller';
import { LoginLogService } from './login-log/login-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginLog } from './login-log/login-log.entity';
import { OperationLogController } from './operation-log/operation-log.controller';
import { OperationLogService } from './operation-log/operation-log.service';
import { OperationLog } from './operation-log/operation-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoginLog, OperationLog])],
  controllers: [LoginLogController, OperationLogController],
  providers: [LoginLogService, OperationLogService],
})
export class MonitorModule {}
