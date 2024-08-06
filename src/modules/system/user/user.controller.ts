import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './user.dto';
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

@ApiTags('用户管理')
@ApiBearerAuth('bearer')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiCreatedResponse({ type: User })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Permissions('system:user:list')
  @ApiOperation({ summary: '获取用户列表' })
  @ApiPaginatedResponse(User)
  findAll(@Query() queryUserDto: QueryUserDto): Promise<PaginatedDto<User>> {
    return this.userService.findAll(queryUserDto);
  }

  // @Get('info')
  // @ApiOperation({ summary: '获取用户信息' })
  // @ApiOkResponse({ type: User })
  // async findSelf(@ActiveUser() user: ActiveUserData) {
  //   return this.userService.findSelf(user.sub);
  // }

  // @Patch('changePassword')
  // @ApiOperation({ summary: '修改密码' })
  // @ApiOkResponse({ type: User })
  // async changePassword(
  //   @Body() { id, oldPassword, password }: ChangePasswordDto,
  // ) {
  //   return this.userService.changePassword(id, password, oldPassword);
  // }

  @Get(':id')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiOkResponse({ type: User })
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiOkResponse({ type: User })
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
