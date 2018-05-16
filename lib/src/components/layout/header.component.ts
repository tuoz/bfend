import { Component, Input, TemplateRef } from '@angular/core';
import { BfSettingsService } from '../../settings.service';
import { BfAppService } from '../../app.service';
import { BfChangePasswordComponent } from '../change-password.component';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'bf-header',
  template: `
    <div class="bf-header">
      <div class="bf-header-title">
        <img class="bf-header-title__logo" [src]="bfLogo" alt="logo">
        <h1 class="bf-header-title_text">{{settings.app.title}}</h1>
      </div>

      <div class="bf-nav">
        <ul class="bf-nav__menu">
          <li class="bf-nav__menu-item" (click)="toggleAside()">
            <i class="bf-nav__menu-icon anticon anticon-menu-{{settings.layout.collapsed ? 'unfold' : 'fold'}}"></i>
          </li>
        </ul>

        <ng-template *ngIf="bfNav" [ngTemplateOutlet]="bfNav"></ng-template>
      </div>
    </div>
  `
})
export class BfHeaderComponent {

  @Input() bfNav: TemplateRef<any>;
  @Input() bfLogo: string;

  constructor(public settings: BfSettingsService) {}

  toggleAside() {
    this.settings.toggleCollapsed();
  }
}
