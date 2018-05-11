import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded, BfendCoreModule } from 'bfend'
import { environment as env } from '../../environments/environment'
import { MeApi } from './api/me.api';

@NgModule({
  imports: [
    BfendCoreModule.forRoot({
      app_key: env.app_key,
      api_base_uri: env.api_base_uri
    })
  ],
  providers: [
    MeApi
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf()parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
