import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  RefreshTokenIdsStorage,
  InvalidatedRefreshTokenError,
} from './refresh-token-ids.storage';
import { HashingService } from '../hashing/hashing.service';
import { User } from 'src/modules/system/user/user.entity';
import { randomUUID } from 'crypto';
import { LoginLogService } from 'src/modules/monitor/login-log/login-log.service';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly loginlogService: LoginLogService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly logger: Logger,
  ) {}

  // 生成 access token 传入 用户 id, 过期时间, payload
  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      { sub: userId, ...payload },
      { secret: this.jwtConfiguration.secret, expiresIn },
    );
  }

  async signUp({ account, nickname, password }: SignUpDto): Promise<User> {
    try {
      const user = new User();
      user.account = account;
      user.password = await this.hashingService.hash(password);
      user.nickname = nickname;

      return this.userRepository.save(user);
    } catch (error) {
      const pgUniqueViolationCode = '23505';
      if (error.code === pgUniqueViolationCode) {
        throw new ConflictException('用户名已存在');
      }
      throw error;
    }
  }

  async signIn(signInDto: SignInDto, request: Request) {
    // const user = await this.userRepository.findOneBy({
    //   account: signInDto.account,
    // });
    const user = await this.userRepository.findOne({
      where: { account: signInDto.account },
      select: ['id', 'account', 'password', 'nickname'],
    });
    console.log('user', user);

    if (!user) {
      throw new UnauthorizedException('用户名不存在');
    }
    const isEquals = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEquals) {
      throw new UnauthorizedException('密码错误');
    }
    // 记录登录日志
    this.logger.log('登录', AuthenticationService.name);
    console.log('request', request.ip);
    await this.loginlogService.create({
      userId: user.id,
      sessionId: '',
      account: user.account,
      ip: request.ip || '',
    });

    // 生成 access token
    return await this.generateTokens(user);
  }

  async generateTokens(user: User) {
    // 生成随机 id
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          account: user.account,
          nickname: user.nickname || '',
        },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshTokenIdsStorage.insert(user, refreshTokenId);
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      // 验证传入的刷新令牌 获取用户id
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, { secret: this.jwtConfiguration.secret });
      // 获取用户实例
      const user = await this.userRepository.findOneByOrFail({ id: sub });
      // 验证刷新令牌是否有效
      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token 已过期');
      }
      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof InvalidatedRefreshTokenError) {
        throw new UnauthorizedException('Access token 已过期');
      }
      throw new UnauthorizedException();
    }
  }
}
