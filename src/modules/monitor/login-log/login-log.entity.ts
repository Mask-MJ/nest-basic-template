import { Base } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class LoginLog extends Base {
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '账号' })
  account: string;

  @Column({ comment: 'IP' })
  ip: string;

  @Column({ comment: '地址' })
  address: string;
}
