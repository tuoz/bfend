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
    if (future.routeConfig === curr.routeConfig) {
      if (curr.routeConfig && curr.routeConfig.data && curr.routeConfig.data['keep_alive']) {
        // Angular 对 shouldReuseRoute 的调用参数循序有问题，多次调用顺序不一致
        // 见 create_router_state.ts:26, create_router_state.ts:68
        // 故，出次下策
        // 据观察，第一次调用参数是正确的(curr 理解为当前状态，future 理解为前一个状态)
        if (future['__current__']) {
          delete future['__current__'];
          const sw = curr;
          curr = future;
          future = sw;
        } else {
          curr['__current__'] = true;
        }

        if (typeof curr.queryParams[KEEP_ALIVE_ID] === 'undefined') {
          delete this.cacheRouters[getRouteUrl(curr)];
          delete curr['__current__'];
          delete future['__current__'];
          return false;
        }
      }

      return true;
    }

    return false;
  }
}


function getRouteUrl(route: ActivatedRouteSnapshot) {
  let p = route;
  const url = [];

  while (p) {
    url.push(...p.url.map(f => f.toString()).reverse());
    p = p.parent;
  }

  const query = Object.keys(route.queryParams)
    .filter(k => k !== KEEP_ALIVE_ID)
    .map(k => `${k}=${route.queryParams[k]}`);

  return url.reverse().join('/') + (query.length > 0 ? '?' + query.join('&') : '');
}
