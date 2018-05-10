import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgProgressModule } from 'ngx-progressbar';

import { BfLayoutComponent } from './src/components/layout/layout.component';
import { BfFullScreenComponent } from './src/components/layout/fullscreen.component';
import { BfHeaderComponent } from './src/components/layout/header.component';
import { BfAsideComponent } from './src/components/layout/aside.component';
import { BfFooterComponent } from './src/components/layout/footer.component';
import { BfPageComponent } from './src/components/layout/page.component';
import { BfModalProxyComponent } from './src/components/modal-proxy.component';
import { BfStateTextComponent } from './src/components/state-text.component';
import { BfChangePasswordComponent } from './src/components/layout/change-password.component';
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
