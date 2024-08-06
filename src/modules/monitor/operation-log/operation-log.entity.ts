import { Column, Entity } from 'typeorm';
import { LoginLog } from '../login-log/login-log.entity';

@Entity()
export class OperationLog extends LoginLog {
  @Column({ comment: '标题' })
  title: string;

  @Column({ comment: '业务类型 0其它 1新增 2修改 3删除' })
  businessType: number;

  @Column({ comment: '模块' })
  module: string;
}
