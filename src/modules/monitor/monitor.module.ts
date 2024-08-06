import { Module } from '@nestjs/common';
import { LoginLogController } from './login-log/login-log.controller';
import { LoginLogService } from './login-log/login-log.service';

@Module({
  imports: [],
  controllers: [LoginLogController],
  providers: [LoginLogService],
})
export class MonitorModule {}
