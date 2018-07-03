import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { BFEND_OPTIONS, BfendOptions } from '../options.type';
import { BfKeepAliveService } from './keep-alive.service';

interface RouteStorageObject {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
}

@Injectable()
export class BfKeepAliveReuseStrategy implements RouteReuseStrategy {

  private cacheRouters: { [key: string]: RouteStorageObject } = {};
  private readonly ID;

  constructor(@Inject(BFEND_OPTIONS) options: BfendOptions) {
    this.ID = options.keep_alive_id;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return typeof route.queryParams[this.ID] !== 'undefined';
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (handle == null) {
      return;
    }
    this.cacheRouters[this.getRouteUrl(route)] = {
      snapshot: route,
      handle: handle
    };
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && typeof route.queryParams[this.ID] !== 'undefined'
      && !!this.cacheRouters[this.getRouteUrl(route)];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (!!route.routeConfig && typeof route.queryParams[this.ID] !== 'undefined'
      && !!this.cacheRouters[this.getRouteUrl(route)]) {
      return this.cacheRouters[this.getRouteUrl(route)].handle;
    } else {
      return null;
    }
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  getRouteUrl(route: ActivatedRouteSnapshot) {
    const url = route.pathFromRoot
      .filter(r => r.url && r.url.length > 0)
      .map(r => r.url.map(u => u.toString()).join('/'))
      .join('/');

    const query = Object.keys(route.queryParams)
      .filter(k => k !== this.ID)
      .map(k => `${k}=${route.queryParams[k]}`);

    return url + (query.length > 0 ? '?' + query.join('&') : '');
  }
}
