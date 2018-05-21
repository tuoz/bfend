import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { TableApi } from './table.api';

@Component({
  template: `
    <bf-page caption="表格详情">
      <nz-card>
        <div nz-row nzType="flex" [nzGutter]="16">
          <h3 nz-col [nzSpan]="24" class="mb-lg">表格详情</h3>
          <div nz-col [nzLg]="8" [nzSm]="24" class="mb-lg"><span class="text-darker">姓名：</span>{{data.name}}</div>
          <div nz-col [nzLg]="8" [nzSm]="24" class="mb-lg"><span class="text-darker">年龄：</span>{{data.age}}</div>
          <div nz-col [nzLg]="8" [nzSm]="24" class="mb-lg"><span class="text-darker">地址：</span>{{data.address}}</div>
        </div>
      </nz-card>
    </bf-page>
  `
})

export class TableProfileComponent implements OnInit {

  private id;
  data: any = {};
  private alive = true;

  constructor(private route: ActivatedRoute, private api: TableApi) { }

  ngOnInit() {
    this.route.paramMap.pipe(takeWhile(() => this.alive)).subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.load();
    })
  }

  load() {
    this.api.profile(this.id).subscribe(res => this.data = res);
  }
}
