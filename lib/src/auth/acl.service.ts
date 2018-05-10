import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/operators/refCount';

export interface ACLType {
  /**
   * 角色
   */
  roles?: string[];
  /**
   * 权限点
   */
  abilities?: string[];
  /**
   * 是否超级用户
   */
  super?: boolean;
}

type Mutation = (rules: ACLType) => ACLType;

/**
 * 访问控制服务
 */
@Injectable()
export class ACLService {
  rules$: Observable<ACLType>;

  private rules: ACLType = {};

  private updateSubject = new ReplaySubject<Mutation>();

  private setSubject = new Subject<ACLType>();

  private cleanSubject = new Subject();

  private addSubject = new Subject<ACLType>();

  constructor() {
    this.rules$ = this.updateSubject
      .scan((rules: ACLType, mutaion: Mutation) => ({ ...mutaion(rules) }), {} as ACLType)
      .do(value => this.rules = value)
      .publishReplay(1)
      .refCount();

    this.setSubject
      .map<ACLType, Mutation>(value => () => value)
      .subscribe(this.updateSubject);

    this.cleanSubject
      .map<any, Mutation>(() => () => ({}))
      .subscribe(this.updateSubject);

    this.addSubject
      .map(this.addMutation.bind(this))
      .subscribe(this.updateSubject);
  }

  /**
   * 设置当前用户角色或权限能力（会先清除所有）
   */
  set(value: ACLType) {
    this.setSubject.next(value);
  }

  /**
   * 清除所有权限
   */
  clean() {
    this.cleanSubject.next();
  }

  /**
   * 为当前用户增加角色或权限能力
   */
  add(value: ACLType) {
    this.addSubject.next(value);
  }

  /**
   * 当前用户是否有对应权限
   * 支持 ability.* 通配符
   */
  can(abilityOrAcl: string | string[] | ACLType): boolean {
    if (!abilityOrAcl || this.rules.super === true) {
      return true;
    }

    const abilities = typeof abilityOrAcl === 'string' ? [abilityOrAcl] : abilityOrAcl;

    if (!Array.isArray(abilities)) {
      const acl = <ACLType>abilities;
      return (acl.abilities && this.can(acl.abilities)) || (acl.roles && this.is(acl.roles));
    } else {
      if (!this.rules.abilities || this.rules.abilities.length === 0) {
        return false;
      }

      for (const v of abilities) {
        if (
          this.rules.abilities.find(
            a => (v.includes('*') ? a.startsWith(v.substr(0, v.indexOf('*') - 1)) : a === v)
          )
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 当前用户是否拥有某个角色
   */
  is(role: string | string[]): boolean {
    if (!role || this.rules.super === true) {
      return true;
    }

    if (!this.rules.roles || this.rules.roles.length === 0) {
      return false;
    }

    const roles = typeof role === 'string' ? [role] : role;

    for (const r of roles) {
      if (this.rules.roles.indexOf(r) > -1) {
        return true;
      }
    }

    return false;
  }

  private addMutation(value: ACLType): Mutation {
    return rules => {
      if (value.roles && value.roles.length > 0) {
        rules.roles.push(...value.roles);
        rules = { ...rules, roles: [...rules.roles, ...value.roles] };
      }

      if (value.abilities && value.abilities.length > 0) {
        rules.abilities.push(...value.abilities);
        rules = { ...rules, abilities: [...rules.abilities, ...value.abilities] };
      }

      if (typeof value.super !== 'undefined') {
        rules.super = value.super;
      }

      return rules;
    };
  }
}
