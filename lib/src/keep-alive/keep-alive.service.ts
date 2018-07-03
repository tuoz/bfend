import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BFEND_OPTIONS, BfendOptions } from '../options.type';

@Injectable()
export class BfKeepAliveService {

  constructor(private router: Router, @Inject(BFEND_OPTIONS) private options: BfendOptions) {}

  mark(): Promise<any> {
    const url = this.router.parseUrl(this.router.url);

    if (typeof url.queryParams[this.options.keep_alive_id] === 'undefined') {
      url.queryParams[this.options.keep_alive_id] = '';
      return this.router.navigateByUrl(url, {replaceUrl: true});
    }

    return Promise.resolve();
  }
}
