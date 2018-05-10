import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login.component';

const COMPONENTS = [
  LoginComponent
];

@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  providers: [],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class AuthModule {
}
