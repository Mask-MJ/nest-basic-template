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
import { DeptService } from './dept.service';
import { CreateDeptDto, QueryDeptDto, UpdateDeptDto } from './dept.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Dept } from './dept.entity';
import { ApiPaginatedResponse } from 'src/common/response/paginated.response';
import { ActiveUser } from 'src/modules/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@ApiTags('部门管理')
@ApiBearerAuth('bearer')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post()
  @ApiOperation({ summary: '创建部门' })
  @ApiCreatedResponse({ type: Dept })
  create(@Body() createDeptDto: CreateDeptDto) {
    return this.deptService.create(createDeptDto);
  }

  @Get()
  @ApiOperation({ summary: '获取部门列表' })
  @ApiPaginatedResponse(Dept)
  findAll(@Query() queryDeptDto: QueryDeptDto) {
    return this.deptService.findAll(queryDeptDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取部门详情' })
  @ApiOkResponse({ type: Dept })
  findOne(@Param('id') id: number) {
    return this.deptService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新部门' })
  @ApiOkResponse({ type: Dept })
  update(
    @Param('id') id: number,
    @ActiveUser() activeUser: ActiveUserData,
    @Body() updateDeptDto: UpdateDeptDto,
  ) {
    return this.deptService.update(id, activeUser, updateDeptDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除部门' })
  remove(@Param('id') id: number) {
    return this.deptService.remove(id);
  }
}
