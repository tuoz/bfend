import { Component } from '@angular/core';
import { BfSettingsService } from '../../settings.service';
import { BfAppService } from '../../app.service';
import { BfChangePasswordComponent } from './change-password.component';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'bf-header',
  template: `
    <div class="title">
      <img class="title__logo" src="assets/img/logo_header.png" alt="logo">
      <h1 class="title_text">{{settings.app.title}}</h1>
    </div>

    <div class="nav">
      <ul class="nav__menu">
        <li class="nav__menu-item" (click)="toggleAside()">
          <i class="nav__menu-icon anticon anticon-menu-{{settings.layout.collapsed ? 'unfold' : 'fold'}}"></i>
        </li>
      </ul>
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
    </div>
  `,
  styleUrls: ['./header.component.less']
})
export class BfHeaderComponent {
  constructor(private nzModal: NzModalService, public settings: BfSettingsService, public app: BfAppService) {
  }

  toggleAside() {
    this.settings.toggleCollapsed();
  }

  logout() {
    this.app.logout();
  }

  changePassword() {
    const modal = this.nzModal.create({
      nzTitle: '修改密码',
      nzContent: BfChangePasswordComponent,
      nzMaskClosable: false
    });

    const sub = modal.afterClose.subscribe(res => {
      if (res === 'ok') {
        setTimeout(() => sub.unsubscribe());
      }
    });
  }
}
