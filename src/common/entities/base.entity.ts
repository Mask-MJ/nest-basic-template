import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Base {
  @PrimaryGeneratedColumn({ type: 'int', comment: '用户ID' })
  id: number;

  @Column({ default: true, comment: '状态' })
  status: boolean;

  @Column({ nullable: true, comment: '创建者' })
  createBy: string;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createTime: Date;

  @Column({ nullable: true, comment: '更新者' })
  updateBy: string;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updateTime: Date;

  @Column({ nullable: true, comment: '备注' })
  remark: string;
}
