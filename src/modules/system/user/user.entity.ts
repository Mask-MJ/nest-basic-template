import { ApiHideProperty } from '@nestjs/swagger';
import { Base } from 'src/common/entities/base.entity';
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { Role } from '../role/role.entity';

@Index(['account', 'nickname'])
@Entity()
export class User extends Base {
  @Column({ type: 'varchar', length: 30, comment: '用户名' })
  account: string;

  @ApiHideProperty()
  @Column({ type: 'varchar', length: 200, select: false, comment: '密码' })
  password: string;

  @Column({ default: false, comment: '是否管理员' })
  isAdmin: boolean;

  @Column({ type: 'varchar', length: 30, nullable: true, comment: '昵称' })
  nickname: string;

  @Column({ nullable: true, comment: '头像' })
  avatar: string;

  @Column({ nullable: true, comment: '邮箱' })
  email: string;

  @Column({ nullable: true, comment: '手机号' })
  phoneNumber: string;

  @Column({ default: 1, comment: '性别' })
  sex: number;

  @Column({ type: 'varchar', length: 128, default: '', comment: '最后登录IP' })
  loginIp: string;

  @Column({ nullable: true, type: 'timestamp', comment: '最后登录时间' })
  loginTime: Date;

  @JoinTable()
  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  roles: Role[];
}
