import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor as HttpInterceptorInterface,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'zone.js';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ApiError } from './api.error';

@Injectable()
export class HttpInterceptor implements HttpInterceptorInterface {
  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .map(res => {
        if (res.type !== HttpEventType.Response) {
          return res;
        }

        // 处理接口数据返回
        if (res && res.body &&
          typeof res.body.code !== 'undefined' &&
          typeof res.body.msg !== 'undefined' &&
          typeof res.body.payload !== 'undefined'
        ) {
          // 将接口错误转为异常
          if (res.body.code > 0) {
            throw new ApiError(res.body.code, res.body.msg, res.body.payload);
          }

          // 将返回结构控制字段去除掉，直接返回数据字段
          return res.clone({body: res.body.payload});
        }

        return res;
      })
      .catch(err => {
        if (!(err instanceof ApiError || err instanceof HttpErrorResponse)) {
          console.error(err);
        }

        return Observable.throw(err);
      });
  }
}
