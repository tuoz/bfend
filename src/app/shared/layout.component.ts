import { Component, OnInit } from '@angular/core';
import { BfAppService } from 'bfend';
import { BfChangePasswordComponent } from 'bfend/src/components/change-password.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { takeUntil } from 'rxjs/operators';
import { MeApi } from '../core/api/me.api';

@Component({
  selector: 'app-layout',
  template: `
    <ng-template #headerNav>
      <ul class="nav__menu">
        <li class="nav__menu-item">
          <nz-tooltip nzPlacement="bottom" nzTitle="修改密码">
            <span nz-tooltip (click)="changePassword()" class="nav__menu-link pr-sm pl-sm">
              <i class="nav__menu-icon anticon anticon-user"></i>
              {{app.user.name}}
            </span>
          </nz-tooltip>
        </li>

        <li class="nav__menu-item">
          <nz-tooltip nzTitle="退出登录">
            <a nz-tooltip (click)="logout()" class="nav__menu-link">
              <i class="nav__menu-icon anticon anticon-logout"></i>
            </a>
          </nz-tooltip>
        </li>
      </ul>
    </ng-template>
    
    <bf-layout [headerNav]="headerNav"></bf-layout>
  `
})

export class LayoutComponent implements OnInit {
  constructor(public app: BfAppService, private nzModal: NzModalService, private nzMessage: NzMessageService, private meApi: MeApi) { }

  ngOnInit() { }

  logout() {
    this.app.logout();
  }

  changePassword() {
    const modal = this.nzModal.create({
      nzTitle: '修改密码',
      nzContent: BfChangePasswordComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => new Promise((resolve, reject) => {
        const value = modal.getContentComponent().getValue();

        if (value == null) {
          reject(false);
          return;
        }

        this.meApi.changePassword(value.old_password, value.new_password)
          .subscribe(() => {
            this.nzMessage.success('修改成功');
            resolve();
          }, () => reject(false))
      })
    });

    // const sub = modal.afterClose.pipe(takeUntil(res => res === 'ok')).subscribe(res => {
    //   if (res === 'ok') {
    //     setTimeout(() => sub.unsubscribe());
    //   }
    // });

    // const modal = this.nzModal.create({
    //   nzTitle: 'Modal Title',
    //   nzContent: 'string, will close after 1 sec',
    //   nzClosable: false,
    //   nzOnOk: () => new Promise((resolve) => window.setTimeout(resolve, 1000))
    // });
  }
}
