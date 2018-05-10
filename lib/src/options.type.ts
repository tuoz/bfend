import { InjectionToken } from '@angular/core';

export interface Options {
  app_key: string;
  api_base_uri: string;
  url_app: string;
  url_login: string;
}

export const BFEND_OPTIONS = new InjectionToken<Options>('dfend-app-options');

let bfendOptions: Options = {
  app_key: '',
  api_base_uri: '',
  url_app: '/app',
  url_login: '/auth/login'
};

export function setOptions(options: Options) {
  bfendOptions = options;
}

export function getOptions() {
  return bfendOptions;
}

