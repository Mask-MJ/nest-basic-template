import {
  ConflictException,
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
import { In, Repository } from 'typeorm';
import { HashingService } from 'src/modules/iam/hashing/hashing.service';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly hashingService: HashingService,
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
    const { page, pageSize } = queryUserDto;
    const [rows, total] = await this.userRepository.findAndCount({
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
