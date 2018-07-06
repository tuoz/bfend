import { Type } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { scan, tap, map, filter, mapTo } from 'rxjs/operators';
import { merge } from './utils/object';

export class ComponentParameter<T extends object> {

  private readonly subject: BehaviorSubject<Partial<T>>;

  public readonly params$: Observable<T>;

  private readonly activatedRoute: ActivatedRoute;

  private readonly defaultParams: T;

  constructor(private cmp: Type<any>, private parameters: T, activatedRoute: ActivatedRoute, private router: Router) {
    this.defaultParams = Object.assign({}, parameters) as T;
    this.activatedRoute = findActivatedRoute(activatedRoute, this.cmp);
    this.subject = new BehaviorSubject(merge(this.parameters, this.activatedRoute.snapshot.params || {}));
    this.params$ = this.initParams();

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

  private initParams() {
    return this.subject.asObservable().pipe(
      tap(v => console.log(v)),
      scan<T, Partial<T>>((acc, p) => merge(acc, p), {} as T),
      tap<T>(p => {
        this.parameters = p;

        const params = {...this.activatedRoute.snapshot.params};

        for (let i of Object.keys(p)) {
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
        })
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
