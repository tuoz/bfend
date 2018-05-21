import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export const KEEP_ALIVE_ID = '_keep';

@Injectable()
export class BfKeepAliveService {

  constructor(private router: Router) {}

  mark(): Promise<any> {
    const url = this.router.parseUrl(this.router.url);

    if (typeof url.queryParams[KEEP_ALIVE_ID] === 'undefined') {
      url.queryParams[KEEP_ALIVE_ID] = '';
      return this.router.navigateByUrl(url, {replaceUrl: true});
    }

    return Promise.resolve();
  }
}
