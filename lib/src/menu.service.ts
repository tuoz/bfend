import { Observable } from 'rxjs/Observable';
import { distinct, filter, map, publishReplay, refCount, scan, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ACLService, ACLType } from './auth/acl.service';
import { Injectable } from '@angular/core';

export interface Menu {
  // 文本
  text: string;
  // i18n主键
  translate?: string;
  // 是否菜单组
  group?: boolean;
  // angular 链接
  link?: string;
  // 外部链接
  externalLink?: string;
  // 链接 target
  target?: '_blank' | '_self' | '_parent' | '_top';
  // 图标
  icon?: string;
  // 徽标数，展示的数字
  badge?: number;
  // 徽标数，显示小红点
  badge_dot?: boolean;
  // 徽标数，设置 Badge 颜色 （默认：error）
  badge_status?: string;
  // 是否隐藏
  hide?: boolean;
  // ACL配置
  acl?: string | string[] | ACLType;
  // 二级菜单
  children?: Menu[];
  // 菜单类型，无须指定由 Service 自动识别
  // 1：链接
  // 2：外部链接
  // 3：链接（子菜单）
  _type?: number;
  // 是否选中
  _selected?: boolean;
  // 是否打开
  _open?: boolean;
  _depth?: number;

  [key: string]: any;
}

type Mutation = (menus: Menu[]) => Menu[];

@Injectable()
export class MenuService {
  menus$: Observable<Menu[]>;

  private data: Menu[] = [];

  private updateSubject = new ReplaySubject<Mutation>();

  private setSubject = new Subject<Menu[]>();

  private toggleOpenSubject = new Subject<Menu>();

  private currentSubject = new Subject<Menu>();

  private refreshSubject = new Subject();

  valid$: Observable<boolean>;

  constructor(private aclService: ACLService) {
    // 最新的菜单数据
    this.menus$ = this.updateSubject.pipe(
      scan((menus: Menu[], mutation: Mutation) => [...mutation(menus)], []),
      tap(menus => (this.data = menus)),
      publishReplay(1),
      refCount()
    );

    this.valid$ = this.menus$.pipe(
      map(menus => menus && menus.length > 0),
      filter(state => state), // select true
      distinct()
    );

    // 设置整个菜单数据结构
    this.setSubject.pipe(map(this.setMutation.bind(this)))
      .subscribe(this.updateSubject);

    // 菜单的打开或关闭
    this.toggleOpenSubject.pipe(map(this.toggleOpenMutation.bind(this)))
      .subscribe(this.updateSubject);

    // 当前菜单，一般是和 URL 关联起来的
    this.currentSubject.pipe(map(this.setCurrentMutation.bind(this)))
      .subscribe(this.updateSubject);

    this.refreshSubject.pipe(map(this.refreshMutation.bind(this)))
      .subscribe(this.updateSubject);

    // 用户权限改变时，重新计算菜单权限
    this.aclService.rules$.subscribe(this.refreshSubject);
  }

  private walk(menus, callback: (item: Menu, parentMenum: Menu, depth?: number) => void) {
    const inFn = (list: Menu[], parentMenu: Menu, depth: number) => {
      for (const item of list) {
        callback(item, parentMenu, depth);
        if (item.children && item.children.length > 0) {
          inFn(item.children, item, depth + 1);
        } else {
          item.children = [];
        }
      }
    };

    inFn(menus, null, 0);
  }

  private prune(menus: Menu[]): Menu[] {
    const result: Menu[] = [];

    for (const item of menus) {
      if (item.hide) {
        continue;
      }

      if (item.children && item.children.length > 0) {
        item.children = this.prune(item.children);
        if ((item._type === 3 || item.group) && item.children.length === 0) {
          continue; // 父菜单和分组如果没有了孩子，自己也消失
        }
      }

      result.push(item);
    }

    return result;
  }

  private normalize(menus: Menu[]): Menu[] {
    let i = 1;

    this.walk(menus, (item, parent, depth) => {
      item.__id = i++;
      item.__parent = parent;
      item._depth = depth;

      // badge
      if (item.badge) {
        if (item.badge_dot !== true) {
          item.badge_dot = false;
        }
        if (!item.badge_status) {
          item.badge_status = 'error';
        }
      }

      item.hide = item.acl && !this.aclService.can(item.acl);

      item._type = item.externalLink ? 2 : 1;
      if (item.children && item.children.length > 0) {
        item._type = 3;
      }
    });

    return this.prune(menus);
  }

  set(items: Menu[]) {
    this.setSubject.next(items);
  }

  setCurrent(menu: Menu) {
    this.currentSubject.next(menu);
  }

  getByUrl(url) {
    let findItem: Menu = null;
    this.walk(this.data, item => {
      item._open = false;
      if (!item.link) {
        return;
      }
      if (!findItem && item.link.includes(url)) {
        findItem = item;
      }
    });

    return findItem;
  }

  getPathByUrl(url) {
    let item: Menu = null;
    this.walk(this.data, (i, parent, depth) => {
      if (i.link === url) {
        item = i;
      }
    });

    const ret: Menu[] = [];
    if (!item) {
      return ret;
    }

    do {
      ret.splice(0, 0, item);
      item = item.__parent;
    } while (item);

    return ret;
  }

  toggleOpen(item: Menu) {
    this.toggleOpenSubject.next(item);
  }

  private setMutation(menus: Menu[]): Mutation {
    return () => {
      // 规范化，添加部分计算属性
      return this.normalize(menus);
    };
  }

  private toggleOpenMutation(menu: Menu): Mutation {
    return menus => {
      this.walk(menus, m => {
        if (m.__id !== menu.__id) {
          m._open = false;
          return;
        }

        menu._open = !menu._open;
      });

      return menus;
    };
  }

  private setCurrentMutation(menu: Menu): Mutation {
    return menus => {
      let p = menu;

      if (p) {
        do {
          p._open = true;
          p = p.__parent;
        } while (p);
      }

      return menus;
    };
  }

  private refreshMutation(): Mutation {
    return menus => {
      return this.normalize(menus);
    };
  }
}
