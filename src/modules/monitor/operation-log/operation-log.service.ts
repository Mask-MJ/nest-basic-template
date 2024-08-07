import { Injectable } from '@nestjs/common';
import {
  CreateOperationLogDto,
  QueryOperationLogDto,
} from './operation-log.dto';
import { OperationLog } from './operation-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class OperationLogService {
  constructor(
    @InjectRepository(OperationLog)
    private readonly operationLogRepository: Repository<OperationLog>,
  ) {}
  create(createOperationLogDto: CreateOperationLogDto) {
    return this.operationLogRepository.save(createOperationLogDto);
  }

  async findAll(queryOperationLogDto: QueryOperationLogDto) {
    const { pageSize, page, account, businessType, module } =
      queryOperationLogDto;
    const condition: Record<string, any> = {};
    if (account) {
      condition.account = Like(`%${account}%`);
    }
    if (businessType) {
      condition.businessType = Like(`%${businessType}%`);
    }
    if (module) {
      condition.module = Like(`%${module}%`);
    }
    const [rows, total] = await this.operationLogRepository.findAndCount({
      where: condition,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { rows, total, page, pageSize };
  }

  findOne(id: number) {
    return this.operationLogRepository.findOneOrFail({ where: { id } });
  }
}
