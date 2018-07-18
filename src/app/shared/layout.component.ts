import { Component, OnInit } from '@angular/core';
import { BfAppService } from 'bfend';
import { BfChangePasswordComponent } from 'bfend';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MeApi } from '../core/api/me.api';

@Component({
  selector: 'app-layout',
  template: `
    <ng-template #bfNav>
      <ul class="bf-nav__menu">
        <li class="bf-nav__menu-item">
          <span nz-tooltip nzTitle="修改密码" nzPlacement="bottom" (click)="changePassword()" class="bf-header-nav__menu-link pr-sm pl-sm">
            <i class="bf-nav__menu-icon anticon anticon-user"></i>
            {{app.user.name}}
          </span>
        </li>

        <li class="bf-nav__menu-item">
          <a nz-tooltip nzTitle="推出登录" nzPlacement="bottom" (click)="logout()" class="bf-header-nav__menu-link">
            <i class="bf-nav__menu-icon anticon anticon-logout"></i>
          </a>
        </li>
      </ul>
    </ng-template>

    <bf-layout [bfNav]="bfNav"></bf-layout>
  `
})

export class LayoutComponent implements OnInit {
  constructor(
    public app: BfAppService,
    private nzModal: NzModalService,
    private nzMessage: NzMessageService,
    private meApi: MeApi
  ) { }

  ngOnInit() { }

  logout() {
    this.app.logout();
  }

  changePassword() {
    const modal = this.nzModal.create({
      nzTitle: '修改密码',
      nzContent: BfChangePasswordComponent,
      nzMaskClosable: false,
      nzOnOk: () => new Promise(resolve => {
        const value = modal.getContentComponent().getValue();

        if (value == null) {
          resolve(false);
          return;
        }

        this.meApi.changePassword(value.old_password, value.new_password)
          .subscribe(() => {
            this.nzMessage.success('修改成功');
            resolve();
          }, () => resolve(false));
      })
    });
  }
}
