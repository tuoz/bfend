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
import { NzMessageService } from 'ng-zorro-antd';
import 'zone.js';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import { BfApiError } from './api.error';
import { HTTP_MANAGE_ZONE, BfHttpService } from './http.service';

@Injectable()
export class BfHttpManagedInterceptor implements HttpInterceptorInterface {
  constructor(private http: BfHttpService, private nzMessage: NzMessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .do(res => {
        if (res.type === HttpEventType.Sent && this.isAutoLoading(req)) {
          this.http.setLoading(true);
        }
      })
      .catch(err => {
        if (this.isHandleError(req)) {
          if (err instanceof BfApiError) {
            this.nzMessage.error(err.toString(), {nzDuration: 3000});
          } else if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 422:
                const msg = [];

                if (err.error && err.error.errors) {
                  for (const i of Object.keys(err.error.errors)) {
                    for (const e of err.error.errors[i]) {
                      msg.push(e);
                    }
                  }
                }

                this.nzMessage.error(msg.length > 0 ? msg.join('<br>') : '数据校验失败', {nzDuration: 3000});

                break;

              default:
                this.nzMessage.error('网络错误，请稍后再试', {nzDuration: 3000});
            }
          }
        }

        return Observable.throw(err);
      })
      .finally(() => {
        if (this.isAutoLoading(req)) {
          // 自动 Loading
          this.http.setLoading(false);
        }
      });
  }

  private isAutoLoading(req: HttpRequest<any>) {
    return !req.url.startsWith('assets') && (Zone.current.name !== HTTP_MANAGE_ZONE || Zone.current.get('auto_loading'));
  }

  private isHandleError(req: HttpRequest<any>) {
    return !req.url.startsWith('assets') && (Zone.current.name !== HTTP_MANAGE_ZONE || Zone.current.get('handle_error'));
  }
}
