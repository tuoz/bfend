import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './src/module-import-guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AngularWebStorageModule } from 'angular-web-storage';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';

import { AppService } from './src/app.service';
import { HttpService } from './src/http/http.service';
import { BFEND_OPTIONS, getOptions, Options, setOptions } from './src/options.type';
import { SettingsService } from './src/settings.service';
import { MenuService } from './src/menu.service';
import { ACLService } from './src/auth/acl.service';
import { TokenService, TokenStorage } from './src/auth/token.service';
import { TitleService } from './src/title.service';
import { AuthService } from './src/auth/auth.service';
import { AuthGuard } from './src/auth/auth-guard.service';
import { UploadService } from './src/http/upload.service';
import { HttpManagedInterceptor } from './src/http/http-managed.interceptor';
import { AuthInterceptor } from './src/auth/auth.interceptor';
import { HttpInterceptor } from './src/http/http.interceptor';

export function jwtOptionsFactory(storage: TokenStorage) {
  return {
    skipWhenExpired: false,
    whitelistedDomains: [/^null$/],
    tokenGetter: () => {
      return storage.token;
    }
  };
}

export function startupServiceFactory(appService: AppService): Function {
  return () => appService.startup();
}

/** @dynamic */
@NgModule({
  imports: [
    HttpClientModule,
    AngularWebStorageModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [TokenStorage],
      }
    }),
    NgZorroAntdModule.forRoot()
  ]
})
export class BfendCoreModule {

  constructor(@Optional() @SkipSelf() parentModule: BfendCoreModule) {
    throwIfAlreadyLoaded(parentModule, 'BfendCoreModule');
  }

  static forRoot(options: Partial<Options>): ModuleWithProviders {

    setOptions({
      ...getOptions(),
      ...options
    });

    return {
      ngModule: BfendCoreModule,
      providers: [
        AppService,
        HttpService,
        SettingsService,
        MenuService,
        TitleService,
        TokenService,
        TokenStorage,
        ACLService,
        AuthService,
        AuthGuard,
        UploadService,
        {provide: NZ_I18N, useValue: zh_CN},
        {provide: BFEND_OPTIONS, useValue: getOptions()},
        {
          provide: APP_INITIALIZER,
          useFactory: startupServiceFactory,
          deps: [AppService],
          multi: true
        },
        // 注意：这里后添加的先执行
        {provide: HTTP_INTERCEPTORS, useClass: HttpManagedInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true},
      ]
    };
  }
}
