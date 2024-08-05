import { Base } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Menu } from './menu.entity';

@Entity()
export class Permission extends Base {
  @Column({ type: 'varchar', length: 30, comment: '角色名称' })
  name: string;

  @Column({ type: 'varchar', length: 30, comment: '角色值' })
  value: string;

  @Column({ type: 'int', comment: '排序' })
  sort: number;

  @ManyToOne(() => Menu, (menu) => menu.permissions)
  menu: Menu;
}
