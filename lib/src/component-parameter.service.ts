import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { filter, map, mapTo, tap, observeOn } from 'rxjs/operators';
import { animationFrame } from 'rxjs/scheduler/animationFrame';
import { toSearch, fromSearch } from './http/http.service';
import { BfendOptions, BFEND_OPTIONS } from './options.type';

@Injectable()
export class BfComponentParameterService {

  constructor(private router: Router, @Inject(BFEND_OPTIONS) private options: BfendOptions) { }

  create<T>(activatedRoute: ActivatedRoute, defaultParams: T, transformer: (p: T) => T = null, key = null) {
    key = key || this.options.component_parameter_key || 'p';
    return new BfComponentParameter(activatedRoute, defaultParams, transformer, this.router, key);
  }
}

export class BfComponentParameter<T> {

  private readonly subject: BehaviorSubject<Partial<T>>;

  public readonly params$: Observable<T>;

  private data: T;

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly defaultParams: T,
    private transformer: (p: T) => T,
    private router: Router,
    private key: string
  ) {
    const params = Object.assign({}, defaultParams);
    const searches = fromSearch(this.activatedRoute.snapshot.queryParams[this.key] || '');

    Object.keys(params).forEach(k => {
      if (typeof searches[k] !== 'undefined') {
        params[k] = searches[k];
      }
    });

    this.subject = new BehaviorSubject(params);
    this.data = params;
    this.params$ = this.initParams();

    this.activatedRoute.queryParamMap.pipe(
      filter(v => !v.has(this.key)),
      mapTo(this.defaultParams)
    ).subscribe(this.subject);
  }

  get() {
    return this.data;
  }

  set(p: Partial<T>) {
    this.subject.next(p);
  }

  reset() {
    this.subject.next(this.defaultParams);
  }

  private initParams() {
    return this.subject.asObservable().pipe(
      observeOn(animationFrame),
      map((p: Partial<T>) => Object.assign(this.data, p)),
      map(p => this.transformer ? Object.assign(this.data, this.transformer(p)) : p),
      tap<T>(p => {
        for (const i of Object.keys(p)) {
          if (p[i] == null && p[i] === '') {
            delete p[i];
          }
        }

        this.router.navigate(['.'], {
          replaceUrl: true,
          relativeTo: this.activatedRoute,
          queryParams: {[this.key]: toSearch(p)},
          queryParamsHandling: 'merge'
        });
      })
    );
  }
}
