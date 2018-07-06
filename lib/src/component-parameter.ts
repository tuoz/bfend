import { Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { filter, map, mapTo, tap } from 'rxjs/operators';
import { merge } from './utils/object';

export class BfComponentParameter<T extends object> {

  private readonly subject: BehaviorSubject<Partial<T>>;

  public readonly params$: Observable<T>;

  private readonly activatedRoute: ActivatedRoute;

  private parameters: T;

  constructor(
    private cmp: Type<any>,
    private readonly defaultParams: T,
    private transformer: (p: T) => T,
    activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute = findActivatedRoute(activatedRoute, this.cmp);
    this.subject = new BehaviorSubject(merge({}, defaultParams, this.activatedRoute.snapshot.params || {}));
    this.params$ = this.initParams();
    this.parameters = Object.assign({}, defaultParams) as T;

    this.activatedRoute.params.pipe(
      map(params => Object.keys(params).filter(k => k in this.defaultParams).length),
      filter(v => v === 0),
      mapTo(this.defaultParams)
    ).subscribe(this.subject);
  }

  get() {
    return this.parameters;
  }

  set(p: Partial<T>) {
    this.subject.next(p);
  }

  reset() {
    this.subject.next(this.defaultParams);
  }

  private initParams() {
    return this.subject.asObservable().pipe(
      map((p: Partial<T>) => (this.parameters = merge(this.parameters, p))),
      map(p => this.transformer ? (this.parameters = merge(this.parameters, this.transformer(p))) : p),
      tap<T>(p => {
        this.parameters = p;

        const params = {...this.activatedRoute.snapshot.params};

        for (const i of Object.keys(p)) {
          if (p[i] != null && p[i] !== '') {
            params[i] = p[i];
          } else {
            delete params[i];
          }
        }

        const url = this.router.createUrlTree(
          ['.', params],
          {relativeTo: this.activatedRoute}
        );

        setTimeout(() => {
          this.router.navigateByUrl(url, {replaceUrl: true});
        });
      })
    );
  }
}

function findActivatedRoute(route: ActivatedRoute, cmp: Type<any>) {
  let r = route;
  while (true) {
    if (r.component === cmp) {
      return r;
    }
    r = r.firstChild;
  }
}
