import {
  PartialType,
  IntersectionType,
  PickType,
  ApiProperty,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateUserDto {
  /**
   * 账号
   * @example 'admin'
   */
  @IsString()
  account: string;

  /**
   * 密码
   * @example '123456'
   */
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  password: string;

  /**
   * 昵称
   * @example '管理员'
   */
  @IsString()
  nickname?: string = '';

  /**
   * 头像
   * @example 'http://xxx.com/xxx.jpg'
   */
  @IsString()
  avatar?: string = '';

  /**
   * 邮箱
   * @example 'xxx@qq.com'
   */
  @IsEmail()
  email?: string = '';

  /**
   * 手机号
   * @example '18888888888'
   */
  @IsPhoneNumber('CN')
  phoneNumber?: string = '';

  /**
   * 性别 0: 女 1: 男
   * @example 1
   */
  @IsEnum([0, 1, 2])
  sex?: number = 1;

  /**
   * 状态 false: 禁用 true: 启用
   * @example true
   */
  @IsBoolean()
  status?: boolean = true;

  /**
   * 备注
   * @example '备注'
   */
  @IsString()
  remark?: string = '';
}

export class QueryUserDto extends PartialType(
  IntersectionType(
    PickType(CreateUserDto, [
      'account',
      'nickname',
      'email',
      'phoneNumber',
      'sex',
    ]),
    BaseDto,
  ),
) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: true })
  @IsNumber()
  id: number;
}
