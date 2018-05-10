import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { HttpService } from '../http/http.service';

@Injectable()
export class MeApi {

  constructor(private client: HttpClient, private http: HttpService) {}

  changePassword(oldPassword, newPassword): Observable<boolean> {
    return this.client.post<boolean>(this.http.url('/me/change-password'), {
      old_password: oldPassword,
      new_password: newPassword
    });
  }

}
