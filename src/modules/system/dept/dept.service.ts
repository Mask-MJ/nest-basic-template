import { Injectable } from '@nestjs/common';
import { CreateDeptDto, QueryDeptDto, UpdateDeptDto } from './dept.dto';
import { Dept } from './dept.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Like, Repository, getManager } from 'typeorm';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';

@Injectable()
export class DeptService {
  constructor(
    @InjectDataSource('dept') private readonly dataSource,
    @InjectRepository(Dept) private readonly deptRepository: Repository<Dept>,
  ) {}
  create(user: ActiveUserData, createDeptDto: CreateDeptDto) {
    return this.deptRepository.save({
      ...createDeptDto,
      createBy: user.nickname || user.account,
    });
  }

  findAll(queryDeptDto: QueryDeptDto) {
    const { name } = queryDeptDto;
    return this.deptRepository.manager.getTreeRepository(Dept).findTrees();
  }

  findOne(id: number) {
    return `This action returns a #${id} dept`;
  }

  update(id: number, updateDeptDto: UpdateDeptDto) {
    return `This action updates a #${id} dept`;
  }

  remove(id: number) {
    return `This action removes a #${id} dept`;
  }
}
