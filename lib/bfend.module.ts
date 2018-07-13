import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgProgressModule } from 'ngx-progressbar';
import { AngularWebStorageModule } from 'angular-web-storage';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';

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
import { BfComponentParameterService } from './src/component-parameter.service';

import { BfLayoutComponent } from './src/components/layout/layout.component';
import { BfFullScreenComponent } from './src/components/layout/fullscreen.component';
import { BfHeaderComponent } from './src/components/layout/header.component';
import { BfAsideComponent } from './src/components/layout/aside.component';
import { BfFooterComponent } from './src/components/layout/footer.component';
import { BfPageComponent } from './src/components/layout/page.component';
import { BfModalProxyComponent } from './src/components/modal-proxy.component';
import { BfStateTextComponent } from './src/components/state-text.component';
import { BfChangePasswordComponent } from './src/components/change-password.component';
import { BfACLDirective } from './src/components/acl.directive';
import { BfConfirmationValidatorDirective } from './src/components/confirmation-validator.directive';
import { BfDatetimeValidatorDirective } from './src/components/datetime-validator.directive';
import { BfMinNumberValidatorDirective } from './src/components/min-number-validator.directive';
import { BfMaxNumberValidatorDirective } from './src/components/max-number-validator.directive';
import { BfYuanPipe } from './src/components/yuan.pipe';

const COMPONENTS = [
  BfLayoutComponent,
  BfFullScreenComponent,
  BfHeaderComponent,
  BfAsideComponent,
  BfFooterComponent,
  BfPageComponent,
  BfModalProxyComponent,
  BfStateTextComponent,
  BfChangePasswordComponent
];

const ENTRY_COMPONENTS = [
  BfChangePasswordComponent
];

const DIRECTIVES = [
  BfACLDirective,
  BfConfirmationValidatorDirective,
  BfDatetimeValidatorDirective,
  BfMinNumberValidatorDirective,
  BfMaxNumberValidatorDirective
];

const PIPES = [
  BfYuanPipe
];

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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,

    NgZorroAntdModule,
    NgProgressModule,

    HttpClientModule,
    AngularWebStorageModule,
    NgZorroAntdModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroAntdModule,
    NgProgressModule,

    COMPONENTS,
    DIRECTIVES,
    PIPES
  ],
  declarations: [COMPONENTS, DIRECTIVES, PIPES],
  entryComponents: [ENTRY_COMPONENTS],
})
export class BfendModule {
  static forRoot(options: BfendOptions): ModuleWithProviders {
    return {
      ngModule: BfendModule,
      providers: [
        ...JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [BfTokenStorage],
          }
        }).providers,

        ...NgZorroAntdModule.forRoot().providers,

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
        BfComponentParameterService,
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
