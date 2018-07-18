import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BfHttpService, PaginatedResult, PaginationParameter, SearchCriteria } from 'bfend';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserApi {
  constructor(private client: HttpClient, private http: BfHttpService) {}

  get(searches?: SearchCriteria, pagination?: PaginationParameter) {
    let params: any = {};

    if (searches) {
      params.s = this.http.search(searches);
    }

    if (pagination) {
      params = {...params, ...pagination};
    }

    return this.client.get<PaginatedResult<any[]>>(this.http.url('/user'), {params});
  }

  profile(id) {
    return this.client.get<any>(this.http.url(`/user/${id}`));
  }

  update(id, data) {
    return of(true).pipe(delay(1000));
  }
}
