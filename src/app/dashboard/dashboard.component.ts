import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    <bf-page caption="仪表盘" [description]="description">
      <ng-template #description>欢迎使用本系统</ng-template>

      <nz-card [nzTitle]="title">
        <ng-template #title>
          Card title
        </ng-template>

        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>

      </nz-card>
    </bf-page>
  `
})
export class DashboardComponent implements OnInit {
  ngOnInit() {
  }
}
