import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './src/module-import-guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AngularWebStorageModule } from 'angular-web-storage';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';

import { BfAppService } from './src/app.service';
import { BfHttpService } from './src/http/http.service';
import { BFEND_OPTIONS, BfendOptions } from './src/options.type';
import { BfSettingsService } from './src/settings.service';
import { BfMenuService } from './src/menu.service';
import { BfACLService } from './src/auth/acl.service';
import { TokenService, BfTokenStorage } from './src/auth/token.service';
import { BfTitleService } from './src/title.service';
import { BfAuthService } from './src/auth/auth.service';
import { BfAuthGuard } from './src/auth/auth-guard.service';
import { BfUploadService } from './src/http/upload.service';
import { BfHttpManagedInterceptor } from './src/http/http-managed.interceptor';
import { BfAuthInterceptor } from './src/auth/auth.interceptor';
import { BfHttpInterceptor } from './src/http/http.interceptor';

export function jwtOptionsFactory(storage: BfTokenStorage) {
  return {
    skipWhenExpired: false,
    whitelistedDomains: [/^null$/],
    tokenGetter: () => {
      return storage.token;
    }
  };
}

export function startupServiceFactory(appService: BfAppService): Function {
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
        deps: [BfTokenStorage],
      }
    }),
    NgZorroAntdModule.forRoot()
  ]
})
export class BfendCoreModule {

  constructor(@Optional() @SkipSelf() parentModule: BfendCoreModule) {
    throwIfAlreadyLoaded(parentModule, 'BfendCoreModule');
  }

  static forRoot(options: BfendOptions): ModuleWithProviders {

    return {
      ngModule: BfendCoreModule,
      providers: [
        BfAppService,
        BfHttpService,
        BfSettingsService,
        BfMenuService,
        BfTitleService,
        TokenService,
        BfTokenStorage,
        BfACLService,
        BfAuthService,
        BfAuthGuard,
        BfUploadService,
        {provide: NZ_I18N, useValue: zh_CN},
        {provide: BFEND_OPTIONS, useValue: options},
        {
          provide: APP_INITIALIZER,
          useFactory: startupServiceFactory,
          deps: [BfAppService],
          multi: true
        },
        // 注意：这里后添加的先执行
        {provide: HTTP_INTERCEPTORS, useClass: BfHttpManagedInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: BfAuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: BfHttpInterceptor, multi: true},
      ]
    };
  }
}
