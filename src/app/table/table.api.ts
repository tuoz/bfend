import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BfHttpService, PaginationParameter, PaginatedResult } from 'bfend';

@Injectable()
export class TableApi {
  constructor(private client: HttpClient, private http: BfHttpService) {}

  get(pagination: PaginationParameter) {
    const params: any = {...pagination};
    return this.client.get<PaginatedResult<any>>(this.http.url(`/user`), {params});
  }

  profile(id) {
    return this.client.get<any>(this.http.url(`/user/${id}`));
  }
}
