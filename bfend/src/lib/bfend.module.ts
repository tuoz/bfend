import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgProgressModule } from '@ngx-progressbar/core';
import { AngularWebStorageModule } from 'angular-web-storage';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';

import { BfAppService } from './app.service';
import { BFEND_OPTIONS, BfendOptions } from './options.type';
import { BfTokenStorage } from './auth/token.service';
import { BfHttpManagedInterceptor } from './http/http-managed.interceptor';
import { BfAuthInterceptor } from './auth/auth.interceptor';
import { BfHttpInterceptor } from './http/http.interceptor';

import { BfLayoutComponent } from './components/layout/layout.component';
import { BfFullScreenComponent } from './components/layout/fullscreen.component';
import { BfHeaderComponent } from './components/layout/header.component';
import { BfAsideComponent } from './components/layout/aside.component';
import { BfFooterComponent } from './components/layout/footer.component';
import { BfPageComponent } from './components/layout/page.component';
import { BfModalProxyComponent } from './components/modal-proxy.component';
import { BfStateTextComponent } from './components/state-text.component';
import { BfChangePasswordComponent } from './components/change-password.component';
import { BfACLDirective } from './components/acl.directive';
import { BfConfirmationValidatorDirective } from './components/confirmation-validator.directive';
import { BfDatetimeValidatorDirective } from './components/datetime-validator.directive';
import { BfMinNumberValidatorDirective } from './components/min-number-validator.directive';
import { BfMaxNumberValidatorDirective } from './components/max-number-validator.directive';
import { BfYuanPipe } from './components/yuan.pipe';

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

/** @dynamic */
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

        ...NgProgressModule.forRoot().providers,
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
