import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  QueryUserDto,
  UpdateUserDto,
} from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { In, Like, Repository } from 'typeorm';
import { HashingService } from 'src/modules/iam/hashing/hashing.service';
import { Role } from '../role/role.entity';
import { Request } from 'express';
import { ActiveUserData } from 'src/modules/iam/interfaces/active-user-data.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  constructor(
    private readonly hashingService: HashingService,
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      user.account = createUserDto.account;
      user.password = await this.hashingService.hash(createUserDto.password);
      user.nickname = createUserDto.nickname;
      user.roles = await this.roleRepository.find({
        where: { id: In(createUserDto.roleIds) },
      });

      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('账号已存在');
      }
      throw error;
    }
  }

  async findAll(queryUserDto: QueryUserDto) {
    const { account, nickname, sex, page, pageSize } = queryUserDto;
    const condition: Record<string, any> = {
      sex,
    };
    if (account) {
      condition.username = Like(`%${account}%`);
    }
    if (nickname) {
      condition.nickname = Like(`%${nickname}%`);
    }

    const [rows, total] = await this.userRepository.findAndCount({
      where: condition,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { rows, total, page, pageSize };
  }

  findSelf(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.menus', 'roles.menus.permissions'],
    });
  }

  async changePassword({ id, password, oldPassword }: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    if (user.isAdmin) {
      return this.userRepository.save({
        ...user,
        password: await this.hashingService.hash(password),
      });
    } else {
      const isPasswordValid = await this.hashingService.compare(
        oldPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new ConflictException('原密码错误');
      }
      return this.userRepository.save({
        ...user,
        password: await this.hashingService.hash(password),
      });
    }
  }

  findOne(id: number) {
    return this.userRepository.findOneOrFail({
      where: { id },
      relations: ['roles', 'roles.menus', 'roles.menus.permissions'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async remove(user: ActiveUserData, id: number, request: Request) {
    const userInfo = await this.userRepository.findOneOrFail({ where: { id } });
    if (userInfo.isAdmin) {
      throw new ConflictException('管理员账号不允许删除');
    }

    await this.userRepository.delete(id);
    this.eventEmitter.emit('user.delete', { user: userInfo, ip: request.ip });

    return '删除成功';
  }
}
