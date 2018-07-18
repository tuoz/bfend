import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'bfend/lib/preloader/preloader';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => {
  return platformBrowserDynamic().bootstrapModule(AppModule, {
    defaultEncapsulation: ViewEncapsulation.Emulated,
    preserveWhitespaces: false
  } as any);
};

bootstrap().then(() => {
  if ((<any>window).appBootstrap) {
    (<any>window).appBootstrap();
  }
});
