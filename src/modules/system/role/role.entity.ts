import { Base } from 'src/common/entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Menu } from '../menu/menu.entity';

@Entity()
export class Role extends Base {
  @Column({ type: 'varchar', length: 30, comment: '角色名称' })
  name: string;

  @Column({ type: 'varchar', length: 30, comment: '角色值' })
  value: string;

  @Column({ type: 'int', comment: '排序' })
  sort: number;

  @JoinTable()
  @ManyToMany(() => Menu, (menu) => menu.roles)
  menus: Menu[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
