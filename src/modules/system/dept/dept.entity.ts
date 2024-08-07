import { Base } from 'src/common/entities/base.entity';
import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';

@Entity()
@Tree('closure-table')
export class Dept extends Base {
  @Column({ type: 'varchar', length: 30, comment: '部门名称' })
  name: string;

  @Column({ type: 'int', comment: '排序' })
  sort: number;

  @Column({ type: 'varchar', length: 30, default: '', comment: '负责人' })
  leader: string;

  @Column({ type: 'varchar', length: 30, default: '', comment: '联系电话' })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 30, default: '', comment: '邮箱' })
  email: string;

  @TreeChildren()
  children: Dept[];

  @TreeParent()
  parent: Dept;
}
