import { Module } from '@nestjs/common';
import { LoginLogModule } from './login-log/login-log.module';

@Module({
  imports: [LoginLogModule],
})
export class MonitorModule {}
