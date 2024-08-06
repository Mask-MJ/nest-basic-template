import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateLoginLogDto {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsString()
  account: string;

  @IsString()
  ip: string;
}

export class QueryLoginDto extends PartialType(
  IntersectionType(PickType(CreateLoginLogDto, ['account']), BaseDto),
) {}
