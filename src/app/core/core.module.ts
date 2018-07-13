import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded, BfendModule } from 'bfend';
import { environment as env } from '../../environments/environment';
import { MeApi } from './api/me.api';
import { UserApi } from './api/user.api';

@NgModule({
  imports: [
    BfendModule.forRoot({
      app_key: env.app_key,
      api_base_uri: env.api_base_uri,
      url_app: '/app',
      url_login: '/auth/login'
    })
  ],
  providers: [
    MeApi, UserApi
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf()parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
