import { Inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationCancel, NavigationEnd, NavigationError, RouteConfigLoadStart, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest, filter } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { NzMessageService } from 'ng-zorro-antd';
import { merge } from 'rxjs/observable/merge';

import { BfMenuService } from './menu.service';
import { BFEND_OPTIONS, BfendOptions } from './options.type';
import { BfSettingsService } from './settings.service';
import { BfACLService } from './auth/acl.service';
import { BfTitleService } from './title.service';
import { BfAuthService } from './auth/auth.service';
import { User } from './auth/user.type';
import { BfHttpService } from './http/http.service';

/**
 * @dynamic
 */
@Injectable()
export class BfAppService {

  private _user: User;

  private isBusySubject = new Subject<boolean>();

  public loading$: Observable<boolean> = merge(this.httpService.loading$, this.isBusySubject);

  get user() {
    return this._user;
  }

  constructor(
    private injector: Injector,
    private httpClient: HttpClient,
    private httpService: BfHttpService,
    private menuService: BfMenuService,
    private settingService: BfSettingsService,
    private aclService: BfACLService,
    private titleService: BfTitleService,
    private authService: BfAuthService,
    @Inject(BFEND_OPTIONS) public options: BfendOptions
  ) {}

  /**
   * 初始化，加载应用基础数据
   */
  startup(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // 保存当前用户快照
      this.authService.user$.subscribe(user => {
        this._user = user;
      });

      // 登录或者退出重新获取应用数据
      this.authService.event$.subscribe(event => {
        if (event === 'logged-in' || event === 'logout') {
          this.httpService.silent(() => this.load().subscribe());
        }
      });

      // URL 改变后查找菜单中当前 URL 对应的菜单并将页面标题设置为对应的菜单名
      this.injector.get(Router).events.pipe(
        filter(event => event instanceof NavigationEnd),
        combineLatest(this.menuService.valid$, (event: NavigationEnd) => event)
      ).subscribe(event => {
        const menu = this.menuService.getByUrl(event.url);

        if (menu) {
          // 高亮当前菜单
          this.menuService.setCurrent(menu);
          // 根据当前菜单或者页面标题元素设置页面标题
          this.titleService.set(menu.text);
        } else {
          this.titleService.set(null);
        }
      });

      // 路由切换行为
      this.injector.get(Router).events.subscribe(evt => {
        if (evt instanceof RouteConfigLoadStart) {
          this.isBusySubject.next(true);
        }
        if (evt instanceof NavigationError || evt instanceof NavigationEnd || evt instanceof NavigationCancel) {
          this.isBusySubject.next(false);
        }
        if (evt instanceof NavigationError) {
          this.injector
            .get(NzMessageService)
            .error(`无法加载${evt.url}路由`, {nzDuration: 1000 * 3});
        }
      });

      // 加载应用基础数据
      this.httpService.silent(() => this.load().subscribe(resolve, reject));
    });
  }

  load() {
    return this.httpClient.get(`${this.options.api_base_uri}${this.options.url_app}`).do((res: any) => {
      // 设置 APP 配置
      this.settingService.setApp(res.app);

      // 设置当前用户
      if (!res.user && this.authService.isLoggedIn()) {
        // 本地 token 有效， 但是服务器认为无效，退出登录
        this.logout();
      }
      this.authService.setUser(res.user);

      // 初始化菜单
      this.menuService.set(res.menus || []);

      // 设置标题后缀
      this.titleService.suffix = res.app.title;
    });
  }

  logout() {
    this.authService.logout();
    this.injector.get(Router).navigate(['/login']);
  }
}
