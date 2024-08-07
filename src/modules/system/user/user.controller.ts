import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  QueryUserDto,
  UpdateUserDto,
} from './user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.entity';
import { PaginatedDto } from 'src/common/dto/base.dto';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';
import { Permissions } from 'src/modules/iam/authorization/decorators/permissions.decorator';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { Request as ExpRequest } from 'express';

@ApiTags('用户管理')
@ApiBearerAuth('bearer')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Permissions('system:user:create')
  @ApiOperation({ summary: '创建用户' })
  @ApiCreatedResponse({ type: User })
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.userService.create(user, createUserDto);
  }

  @Get()
  @Permissions('system:user:list')
  @ApiOperation({ summary: '获取用户列表' })
  @ApiPaginatedResponse(User)
  findAll(@Query() queryUserDto: QueryUserDto): Promise<PaginatedDto<User>> {
    return this.userService.findAll(queryUserDto);
  }

  @Get('info')
  @ApiOperation({ summary: '获取个人信息' })
  @ApiOkResponse({ type: User })
  async findSelf(@ActiveUser() user: ActiveUserData) {
    return this.userService.findSelf(user.sub);
  }

  @Patch('changePassword')
  @ApiOperation({ summary: '修改密码' })
  @ApiOkResponse({ type: User })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(changePasswordDto);
  }

  @Get(':id')
  @Permissions('system:user:info')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiOkResponse({ type: User })
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Permissions('system:user:update')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiOkResponse({ type: User })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Permissions('system:user:delete')
  @ApiOperation({ summary: '删除用户' })
  remove(
    @ActiveUser() user: ActiveUserData,
    @Param('id') id: number,
    @Request() request: ExpRequest,
  ) {
    return this.userService.remove(user, id, request);
  }
}
