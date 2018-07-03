import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { KEEP_ALIVE_ID } from './keep-alive.service';

interface RouteStorageObject {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
}

export class BfKeepAliveReuseStrategy implements RouteReuseStrategy {

  private cacheRouters: { [key: string]: RouteStorageObject } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return typeof route.queryParams[KEEP_ALIVE_ID] !== 'undefined';
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (handle == null) {
      return
    }
    this.cacheRouters[getRouteUrl(route)] = {
      snapshot: route,
      handle: handle
    };
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && typeof route.queryParams[KEEP_ALIVE_ID] !== 'undefined'
      && !!this.cacheRouters[getRouteUrl(route)];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (!!route.routeConfig && typeof route.queryParams[KEEP_ALIVE_ID] !== 'undefined'
      && !!this.cacheRouters[getRouteUrl(route)]) {
      return this.cacheRouters[getRouteUrl(route)].handle;
    } else {
      return null;
    }
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}


function getRouteUrl(route: ActivatedRouteSnapshot) {
  const url = route.pathFromRoot
    .filter(r => r.url && r.url.length > 0)
    .map(r => r.url.map(u => u.toString()).join('/'))
    .join('/');

  const query = Object.keys(route.queryParams)
    .filter(k => k !== KEEP_ALIVE_ID)
    .map(k => `${k}=${route.queryParams[k]}`);

  return url + (query.length > 0 ? '?' + query.join('&') : '');
}
