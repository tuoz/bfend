import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { BfSettingsService } from '../../settings.service';
import { BfAppService } from '../../app.service';
import { NgProgress } from '@ngx-progressbar/core';

@Component({
  selector: 'bf-layout',
  template: `
    <nz-layout class="bf-layout">
      <ng-progress [spinner]="false" [color]="bfProgressColor"></ng-progress>
      <nz-header>
        <bf-header [bfNav]="bfNav" [bfLogo]="bfLogo"></bf-header>
      </nz-header>
      <nz-layout>
        <nz-sider
          [nzWidth]="settings.layout.aside_width"
          [nzCollapsible]="false"
          class="bf-aside"
          [ngClass]="{'bf-aside_collapsed': settings.layout.collapsed}">
          <bf-aside></bf-aside>
        </nz-sider>
        <nz-layout class="bf-primary">
          <nz-content>
            <router-outlet></router-outlet>
          </nz-content>
          <nz-footer>
            <bf-footer></bf-footer>
          </nz-footer>
        </nz-layout>
      </nz-layout>
    </nz-layout>
  `
})
export class BfLayoutComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  private sub = new Subscription();

  @Input() bfNav: TemplateRef<any>;
  @Input() bfLogo = 'assets/img/logo-header.svg';
  @Input() bfProgressColor = '#faad14';

  constructor(
    private ngProgress: NgProgress,
    private app: BfAppService,
    public settings: BfSettingsService
  ) {
    this.loading$ = this.app.loading$;
  }

  ngOnInit() {
    this.sub.add(this.loading$.subscribe(loading => {
      if (loading) {
        this.ngProgress.start();
      } else {
        this.ngProgress.complete();
      }
    }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
