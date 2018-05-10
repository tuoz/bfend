import { InjectionToken } from '@angular/core';

export interface BfendOptions {
  app_key: string;
  api_base_uri: string;
  url_app: string;
  url_login: string;
}

export const BFEND_OPTIONS = new InjectionToken<BfendOptions>('dfend-app-options');

let bfendOptions: BfendOptions = {
  app_key: '',
  api_base_uri: '',
  url_app: '/app',
  url_login: '/auth/login'
};

export function setOptions(options: BfendOptions) {
  bfendOptions = options;
}

export function getOptions() {
  return bfendOptions;
}

