import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { TimeDto } from 'src/common/dto/base.dto';

export class CreateDeptDto {
  /**
   * 部门名称
   * @example '技术部'
   */
  @IsString()
  name: string;
  /**
   * 排序
   * @example 1
   */
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  sort?: number;
  /**
   * 负责人
   * @example '张三'
   */
  @IsString()
  @IsOptional()
  leader?: string;
  /**
   * 负责人电话
   * @example '13000000000'
   */
  @IsString()
  @IsOptional()
  phoneNumber?: string;
  /**
   * 邮箱
   * @example xxx@qq.com
   */
  @IsString()
  @IsOptional()
  email?: string;
  /**
   * 上级部门ID
   * @example 1
   */
  @IsNumber()
  @IsOptional()
  parentId?: number;
  /**
   * 备注
   * @example '这是一个技术部'
   */
  @IsString()
  @IsOptional()
  remark?: string;
}

export class QueryDeptDto extends PartialType(
  IntersectionType(PickType(CreateDeptDto, ['name']), TimeDto),
) {}

export class UpdateDeptDto extends PartialType(CreateDeptDto) {
  @IsNumber()
  id: number;
}
