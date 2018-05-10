import { Inject, Injectable, Injector } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from 'angular-web-storage';
import { BfendOptions, BFEND_OPTIONS } from '../options.type';

export interface TokenData {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_token_valid_time?: number;

  [key: string]: any;
}

@Injectable()
export class BfTokenStorage {

  constructor(private storage: LocalStorageService, @Inject(BFEND_OPTIONS) private options: BfendOptions) {}

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

@Injectable()
export class TokenService {
  constructor(
    private injector: Injector,
    private helper: JwtHelperService,
    private storage: BfTokenStorage
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
