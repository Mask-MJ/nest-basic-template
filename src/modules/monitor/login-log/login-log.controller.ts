import { Controller, Get, Param, Query } from '@nestjs/common';
import { LoginLogService } from './login-log.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { LoginLog } from './login-log.entity';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';
import { QueryLoginDto } from './login-log.dto';

@ApiTags('登录日志管理')
@ApiBearerAuth('bearer')
@Controller('login-log')
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) {}

  @Get()
  @ApiOperation({ summary: '获取日志列表' })
  @ApiPaginatedResponse(LoginLog)
  findAll(@Query() queryLoginDto: QueryLoginDto) {
    return this.loginLogService.findAll(queryLoginDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取日志信息' })
  @ApiOkResponse({ type: LoginLog })
  findOne(@Param('id') id: number) {
    return this.loginLogService.findOne(id);
  }
}
