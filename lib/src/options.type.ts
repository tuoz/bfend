import { InjectionToken } from '@angular/core';

export interface BfendOptions {
  app_key: string;
  api_base_uri: string;
  url_app: string;
  url_login: string;
}

export const BFEND_OPTIONS = new InjectionToken<BfendOptions>('dfend-app-options');

