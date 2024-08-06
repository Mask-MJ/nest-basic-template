import { Injectable } from '@nestjs/common';
import {
  CreateOperationLogDto,
  QueryOperationLogDto,
} from './operation-log.dto';
import { OperationLog } from './operation-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OperationLogService {
  constructor(
    @InjectRepository(OperationLog)
    private readonly operationLogRepository: Repository<OperationLog>,
  ) {}
  create(createOperationLogDto: CreateOperationLogDto) {
    return this.operationLogRepository.save(createOperationLogDto);
  }

  findAll(queryOperationLogDto: QueryOperationLogDto) {
    return `This action returns all operationLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} operationLog`;
  }
}
