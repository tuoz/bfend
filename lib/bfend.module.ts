import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgProgressModule } from 'ngx-progressbar';

import { LayoutComponent } from './src/components/layout/layout.component';
import { FullScreenComponent } from './src/components/layout/fullscreen.component';
import { HeaderComponent } from './src/components/layout/header.component';
import { AsideComponent } from './src/components/layout/aside.component';
import { FooterComponent } from './src/components/layout/footer.component';
import { PageComponent } from './src/components/layout/page.component';
import { ModalProxyComponent } from './src/components/modal-proxy.component';
import { StateTextComponent } from './src/components/state-text.component';
import { ChangePasswordComponent } from './src/components/layout/change-password.component';
import { ACLDirective } from './src/components/acl.directive';
import { ConfirmationValidatorDirective } from './src/components/confirmation-validator.directive';
import { DatetimeValidatorDirective } from './src/components/datetime-validator.directive';
import { MinNumberValidatorDirective } from './src/components/min-number-validator.directive';
import { MaxNumberValidatorDirective } from './src/components/max-number-validator.directive';
import { YuanPipe } from './src/components/yuan.pipe';

const COMPONENTS = [
  LayoutComponent,
  FullScreenComponent,
  HeaderComponent,
  AsideComponent,
  FooterComponent,
  PageComponent,
  ModalProxyComponent,
  StateTextComponent,
  ChangePasswordComponent
];

const ENTRY_COMPONENTS = [
  ChangePasswordComponent
];

const DIRECTIVES = [
  ACLDirective,
  ConfirmationValidatorDirective,
  DatetimeValidatorDirective,
  MinNumberValidatorDirective,
  MaxNumberValidatorDirective
];
const PIPES = [
  YuanPipe
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,

    NgZorroAntdModule,
    NgProgressModule
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
export class BfendModule {}
