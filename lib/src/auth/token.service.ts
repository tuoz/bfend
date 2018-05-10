import { Inject, Injectable, Injector } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from 'angular-web-storage';
import { Options, BFEND_OPTIONS } from '../options.type';

export interface TokenData {
  /**
   * Token 值
   */
  access_token: string;
  /**
   * Token 类型
   */
  token_type?: string;
  /**
   * TOKEN过期时间，格式：timestamp
   */
  expires_in?: number;
  /**
   * 刷新 Token
   */
  refresh_token?: string;

  /**
   * 刷新 Token 有效时间，格式：timestamp
   */
  refresh_token_valid_time?: number;

  [key: string]: any;
}

@Injectable()
export class TokenStorage {

  constructor(private storage: LocalStorageService, @Inject(BFEND_OPTIONS) private options: Options) {}

  get key() {
    return `${this.options.app_key}-token`;
  }

  /**
   * 保存
   */
  set data(token: TokenData | null) {
    this.storage.set(this.key, token);
  }

  /**
   * 获取
   */
  get data(): TokenData | null {
    try {
      const data = this.storage.get(this.key);
      return data && data.access_token ? (data as TokenData) : null;
    } catch (err) {
      return null;
    }
  }

  get token() {
    return this.data && this.data.access_token ? this.data.access_token : null;
  }

  clean() {
    this.storage.remove(this.key);
  }
}

/**
 * 基于Token认证
 */
@Injectable()
export class TokenService {
  constructor(
    private injector: Injector,
    private helper: JwtHelperService,
    private storage: TokenStorage
  ) {
  }

  get data() {
    return this.storage.data;
  }

  set data(data: TokenData | null) {
    this.storage.data = data;
  }

  get token() {
    return this.storage.token;
  }

  clean() {
    this.storage.clean();
  }

  isExpired(token?) {
    try {
      return this.helper.isTokenExpired(token || this.storage.token);
    } catch (e) {
      return false;
    }
  }

  isValid(token?) {
    return !this.isExpired(token);
  }
}
