import { Injectable } from '@nestjs/common';
import { CreateLoginLogDto, QueryLoginDto } from './login-log.dto';
import IP2Region from 'ip2region';
import { LoginLog } from './login-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class LoginLogService {
  constructor(
    @InjectRepository(LoginLog)
    private readonly loginLogRepository: Repository<LoginLog>,
  ) {}
  create(createLoginLogDto: CreateLoginLogDto) {
    const query = new IP2Region();
    const addressInfo = query.search(createLoginLogDto.ip);
    const address = addressInfo ? addressInfo.province + addressInfo.city : '';
    return this.loginLogRepository.save({ ...createLoginLogDto, address });
  }

  async findAll(queryLoginDto: QueryLoginDto) {
    const { pageSize, page, account } = queryLoginDto;

    const condition: Record<string, any> = {};
    if (account) {
      condition.account = Like(`%${account}%`);
    }
    const [rows, total] = await this.loginLogRepository.findAndCount({
      where: condition,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { rows, total, page, pageSize };
  }

  findOne(id: number) {
    return `This action returns a #${id} loginLog`;
  }
}
