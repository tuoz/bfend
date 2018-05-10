import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, publishReplay, refCount, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/operators/refCount';
import { Options, BFEND_OPTIONS } from '../options.type';

import { User } from './user.type';
import { TokenData, TokenService } from './token.service';
import { ACLService } from './acl.service';

export type AuthEvent = 'logged-in' | 'logout';

@Injectable()
export class AuthService {

  private eventSubject = new Subject<AuthEvent>();
  readonly event$ = this.eventSubject.asObservable();

  private userSubject = new Subject<User>();
  readonly user$ = this.userSubject.asObservable().pipe(
    map(user => (user && user.name && user.name.length > 0 ? user : null)),
    tap(user => {
      if (user) {
        if (user.acl) {
          this.aclService.set(user.acl);
        }
      } else {
        this.aclService.clean();
        this.tokenService.clean();
      }
    }),
    publishReplay(1),
    refCount()
  );

  readonly valid$ = this.user$.filter(u => u != null);

  redirectUrl = null;

  constructor(
    private httpClient: HttpClient,
    private aclService: ACLService,
    private tokenService: TokenService,
    @Inject(BFEND_OPTIONS) private options: Options
  ) {}

  isLoggedIn() {
    return this.tokenService.isValid();
  }

  login(username: string, password: string, remember: boolean): Observable<TokenData> {
    return this.httpClient.post<TokenData>(
      `${this.options.api_base_uri}${this.options.url_login}`,
      {username, password, remember}
    ).do(token => {
      this.tokenService.data = token;
      this.eventSubject.next('logged-in');
    });
  }

  logout() {
    this.setUser(null);
    this.eventSubject.next('logout');
  }

  setUser(user: User) {
    this.userSubject.next(user);
  }
}
