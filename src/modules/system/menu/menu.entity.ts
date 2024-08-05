import { Base } from 'src/common/entities/base.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Permission } from './permission.entity';

@Entity()
@Tree('closure-table')
export class Menu extends Base {
  @Column({ type: 'varchar', length: 30, comment: '菜单名称' })
  name: string;

  @Column({ type: 'varchar', length: 100, comment: '菜单路径' })
  path: string;

  @Column({ type: 'varchar', length: 100, comment: '菜单图标' })
  icon: string;

  @Column({ type: 'int', comment: '排序' })
  sort: number;

  @Column({ default: false, comment: '是否隐藏' })
  hidden: boolean;

  @Column({ type: 'int', comment: '类型 0: 目录 1: 菜单 2: 按钮' })
  type: number;

  @Column({ type: 'varchar', length: 100, comment: '权限标识' })
  permission: string;

  @Column({ default: false, comment: '是否外链' })
  isFrame: boolean;

  @Column({ default: true, comment: '是否缓存' })
  cache: boolean;

  @TreeChildren()
  children: Menu[];

  @TreeParent()
  parent: Menu;

  @ManyToMany(() => Role, (role) => role.menus)
  roles: Role[];

  @OneToMany(() => Permission, (permission) => permission.menu)
  permissions: Permission[];
}
