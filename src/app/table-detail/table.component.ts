import { Component, OnDestroy, OnInit, } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TableEditComponent } from 'app/table/table-edit.component';
import { BfComponentParameterService, BfComponentParameter } from 'bfend';
import { NzModalService } from 'ng-zorro-antd';
import { Subject } from 'rxjs/Subject';
import { switchMap, takeWhile, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { isDate } from 'rxjs/util/isDate';
import { UserApi } from '../core/api/user.api';

interface Parameters {
  page: number;
  no: string;
  date: string | Date;
}

@Component({
  template: `
    <bf-page caption="表格" [description]="description">
      <ng-template #description>列表页操作演示</ng-template>

      <nz-card>
        <form class="search-form" nz-form [nzLayout]="'inline'" (submit)="onSearch($event)" (reset)="onSearchReset($event)">
          <nz-row nzType="flex" [nzGutter]="16">
            <nz-col [nzMd]="8" [nzSm]="24">
              <nz-form-item>
                <nz-form-label nzFor="no" style="width:95px;">规则编号</nz-form-label>
                <nz-form-control>
                  <input nz-input name="no" placeholder="请输入" id="no" [(ngModel)]="searches.no">
                </nz-form-control>
              </nz-form-item>
            </nz-col>
            <nz-col [nzMd]="8" [nzSm]="24">
              <nz-form-item>
                <nz-form-label nzFor="status" style="width:95px;">使用时间</nz-form-label>
                <nz-form-control>
                  <nz-date-picker [nzStyle]="{width: '100%'}" name="date" [(ngModel)]="searches.date"></nz-date-picker>
                </nz-form-control>
              </nz-form-item>
            </nz-col>
            <nz-col [nzMd]="8" [nzSm]="24" *ngIf="expandForm">
              <nz-form-item>
                <nz-form-label nzFor="callNo" style="width:95px;">调用次数</nz-form-label>
                <nz-form-control>
                  <input nz-input id="callNo">
                </nz-form-control>
              </nz-form-item>
            </nz-col>
            <nz-col [nzMd]="8" [nzSm]="24" *ngIf="expandForm">
              <nz-form-item>
                <nz-form-label nzFor="updatedAt" style="width:95px;">更新日期</nz-form-label>
                <nz-form-control>
                </nz-form-control>
              </nz-form-item>
            </nz-col>
            <nz-col [nzMd]="8" [nzSm]="24" *ngIf="expandForm">
              <nz-form-item>
                <nz-form-label nzFor="status2" style="width:95px;">使用状态</nz-form-label>
                <nz-form-control>
                  <nz-select [nzPlaceHolder]="'请选择'" nzId="status2" [nzShowSearch]="true">
                    <nz-option [nzLabel]="'成功'" [nzValue]="1"></nz-option>
                    <nz-option [nzLabel]="'失败'" [nzValue]="0"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </nz-col>
            <nz-col [nzMd]="8" [nzSm]="24" *ngIf="expandForm">
              <nz-form-item>
                <nz-form-label nzFor="status3" style="width:95px;">使用状态</nz-form-label>
                <nz-form-control>
                  <nz-select [nzPlaceHolder]="'请选择'" nzId="status3" [nzShowSearch]="true">
                    <nz-option [nzLabel]="'成功'" [nzValue]="1"></nz-option>
                    <nz-option [nzLabel]="'失败'" [nzValue]="0"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </nz-col>
            <nz-col [nzSpan]="expandForm ? 24 : 8" [class.text-right]="expandForm">
              <button nz-button type="submit" [nzType]="'primary'" [nzLoading]="loading">查询</button>
              <button nz-button type="reset" class="mx-sm">重置</button>
              <a (click)="expandForm=!expandForm">
                {{expandForm ? '收起' : '展开'}}
                <i class="anticon" [class.anticon-down]="!expandForm" [class.anticon-up]="expandForm"></i>
              </a>
            </nz-col>
          </nz-row>
        </form>

        <button nz-button [nzType]="'primary'" (click)="edit()" class="mb-sm">
          <i class="anticon anticon-plus"></i>
          <span>新建</span>
        </button>

        <nz-table
          #nzTable
          [nzData]="data"
          [nzFrontPagination]="false"
          [nzTotal]="page.total"
          [(nzPageIndex)]="page.index"
          [(nzPageSize)]="page.size"
          (nzPageIndexChange)="onPageIndexChange($event)"
          [nzSize]="'middle'"
          [nzLoading]="loading"
          [nzLoadingDelay]="1000">
          <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Address</th>
            <th [nzWidth]="'150px'">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let data of nzTable.data">
            <td>{{data.name}}</td>
            <td>{{data.age}}</td>
            <td>{{data.address}}</td>
            <td>
              <span acl="table.detail.show">
                <a routerLink="./show/{{data.id}}">详情</a>
                <nz-divider nzType="vertical"></nz-divider>
              </span>
              <span [acl]="'table.detail.edit'">
                <a (click)="edit(123)">编辑</a>
                <nz-divider nzType="vertical"></nz-divider>
              </span>
              <nz-popconfirm acl="table.detail.delete" [nzTitle]="'确定要删除吗？'">
                <a class="text-error" nz-popconfirm>删除</a>
              </nz-popconfirm>
            </td>
          </tr>
          </tbody>
        </nz-table>
      </nz-card>
    </bf-page>
  `
})
export class TableComponent implements OnInit, OnDestroy {
  data: any = [];

  loading = false;

  expandForm = false;

  page = {
    index: 1,
    size: 15,
    total: 0
  };

  total = 0;

  searches: Pick<Parameters, 'no' | 'date'> = {
    no: null,
    date: new Date()
  };

  private cp: BfComponentParameter<Parameters>;

  private alive = true;

  constructor(
    private nzModal: NzModalService,
    private api: UserApi,
    private route: ActivatedRoute,
    cp: BfComponentParameterService,
  ) {
    this.cp = cp.create<Parameters>(this.route, {
      page: this.page.index,
      ...this.searches
    }, p => {
      this.page.index = p.page;
      this.searches.no = p.no;

      this.searches.date = new Date(p.date.toString());
      this.searches.date = isDate(this.searches.date) ? this.searches.date : null;

      p.date = this.searches.date ? formatDate(this.searches.date) : null;

      return p;
    });
  }

  ngOnInit() {
    this.cp.params$.pipe(
      takeWhile(() => this.alive),
      switchMap(() => {
        const searches = {
          ...this.searches,
          date: this.searches.date ? formatDate(this.searches.date as Date) : null
        };

        const page = {
          page: this.page.index,
          page_size: this.page.size
        };

        this.loading = true;

        return this.api.get(searches, page).pipe(catchError(err => of<HttpErrorResponse>(err)));
      }),
    ).subscribe(res => {
      this.loading = false;

      if (res instanceof HttpErrorResponse) {
        this.data = [];
        this.page.total = 0;
      } else {
        this.data = res.data;
        this.page.total = res.meta.total;
      }
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  load() {
    this.cp.set({});
  }

  edit(id?) {
    const modal = this.nzModal.create({
      nzTitle: id ? '编辑' : '添加',
      nzContent: TableEditComponent,
      nzMaskClosable: false,
      nzComponentParams: {id},
      nzOnOk: () => modal.getContentComponent().submit().then(res => {
        if (res) {
          this.load();
        }
        return res;
      })
    });
  }

  onPageIndexChange(index) {
    this.cp.set({page: index});
  }

  onSearch(e: Event) {
    e.preventDefault();
    this.cp.set({...this.searches});
  }

  onSearchReset(e: Event) {
    e.preventDefault();
    this.cp.reset();
  }
}

function formatDate(date: Date) {
  function pz(n: number) {
    return n < 10 ? `0${n}` : n.toString();
  }
  return `${date.getFullYear()}-${pz(date.getMonth() + 1)}-${pz(date.getDate())}`;
}
