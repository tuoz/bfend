import { Component, Input, TemplateRef } from '@angular/core';
import { BfSettingsService } from '../../settings.service';
import { BfAppService } from '../../app.service';
import { BfChangePasswordComponent } from '../change-password.component';
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

      <ng-template *ngIf="bfNav" [ngTemplateOutlet]="bfNav"></ng-template>
    </div>
  `,
  styleUrls: ['./header.component.less']
})
export class BfHeaderComponent {

  @Input() bfNav: TemplateRef<any>;

  constructor(public settings: BfSettingsService) {}

  toggleAside() {
    this.settings.toggleCollapsed();
  }
}
