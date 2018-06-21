import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { filter, scan, switchMap, delay } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
// noinspection ES6UnusedImports
import {} from 'zone.js';

import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import { of } from 'rxjs/observable/of';
import { BfendOptions, BFEND_OPTIONS } from '../options.type';

export interface ManagedOptions {
  auto_loading: boolean;
  handle_error: boolean;
}

export const HTTP_MANAGE_ZONE = 'http_manage';

interface State {
  diff: number;
  show: boolean;
}

export interface SearchCriteria { [index: string]: any; }

@Injectable()
export class BfHttpService {
  private loadingSubject = new Subject<boolean>();

  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable().pipe(
    scan<boolean, State>(
      ({diff}, show) => (show ? {diff: diff + 1, show} : {diff: diff - 1, show}),
      {
        diff: 0,
        show: false
      }
    ),
    filter(state => state.diff === 0 || (state.diff === 1 && state.show)),
    switchMap(state => of(state.diff === 1).pipe(delay(10)))
  );

  constructor(private httpClient: HttpClient, @Inject(BFEND_OPTIONS) private options: BfendOptions) {}

  url(url) {
    return `${this.options.api_base_uri}${url}`;
  }

  search(criteria: { [index: string]: any }) {
    const searches: string[] = [];
    for (const k of Object.keys(criteria)) {
      if (criteria[k] != null) {
        const key = k.toString().replace(/[:;]/g, '');
        let value = criteria[k];

        if (Array.isArray(value)) {
          value = value.map(v => v.toString().replace(/[,;]/g, '')).join(',');
        } else {
          value = value.toString().replace(/[;]/g, '');
        }

        searches.push(`${key}:${value}`);
      }
    }

    return searches.join(';');
  }

  setLoading(result) {
    this.loadingSubject.next(result);
  }

  silent<T>(cbk: () => T, opts?: Partial<ManagedOptions>): T {
    opts = Object.assign(<ManagedOptions>{auto_loading: false, handle_error: false}, opts || {});
    return Zone.current
      .fork({
        name: HTTP_MANAGE_ZONE,
        properties: opts
      } as any)
      .run<T>(() => {
        return cbk();
      });
  }
}
