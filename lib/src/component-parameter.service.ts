import { Injectable } from '@angular/core';
import { Type } from '@angular/core/src/type';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentParameter } from './component-parameter';

@Injectable()
export class BfComponentParameterService {

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  new<T extends object>(cmp: Type<any>, params: T) {
    return new ComponentParameter(cmp, params, this.activatedRoute, this.router);
  }
}
