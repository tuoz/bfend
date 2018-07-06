import { Injectable } from '@angular/core';
import { Type } from '@angular/core/src/type';
import { ActivatedRoute, Router } from '@angular/router';
import { BfComponentParameter } from './component-parameter';

@Injectable()
export class BfComponentParameterService {

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  new<T extends object>(cmp: Type<any>, defaultParams: T, transformer: (p: T) => T = null) {
    return new BfComponentParameter(cmp, defaultParams, transformer, this.activatedRoute, this.router);
  }
}
