import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu, BfMenuService } from '../../menu.service';

@Component({
  selector: 'bf-aside',
  template: `
    <ng-container *ngFor="let m of menus$ | async">
      <ng-container *ngIf="m.group">
        <section class="bf-aside-group">
          <h2 class="bf-aside-group__title">{{m.text}}</h2>
          <ng-container *ngFor="let m of m.children">
            <ng-container *ngTemplateOutlet="tplMenu; context: {menu: m}"></ng-container>
          </ng-container>
        </section>
      </ng-container>
      <ng-container *ngIf="!m.group">
        <ng-container *ngTemplateOutlet="tplMenu; context: {menu: m}"></ng-container>
      </ng-container>
    </ng-container>

    <ng-template #tplMenu let-menu="menu">
      <ul class="bf-aside-menu">
        <li class="bf-aside-menu__item"
            routerLinkActive="bf-aside-menu__item_active"
            [ngClass]="{
        'bf-aside-menu__item_has-children': menu._type == 3,
        'bf-aside-menu__item_leaf': menu._type !== 3,
        'bf-aside-menu__item_explosed': menu._open && menu._type === 3,
        'bf-aside-menu__item_hidden': menu.hide
      }"
        >
          <div class="bf-aside-menu__title" (click)="toggleOpen(menu)">
            <i class="bf-aside-menu__icon {{menu.icon}}"></i>
            <!-- link -->
            <a class="bf-aside-menu__text" *ngIf="menu._type === 1" [routerLink]="menu.link" target="{{ menu.target }}">
              {{ menu.text }}
            </a>
            <!-- external link -->
            <a class="bf-aside-menu__text" *ngIf="menu._type === 2" href="{{ menu.externalLink }}" target="{{ menu.target }}">
              {{menu.text }}
            </a>
            <!-- has children -->
            <span class="bf-aside-menu__text" *ngIf="menu._type === 3">
          {{ menu.text }}
        </span>
            <nz-badge *ngIf="menu.badge" [nzCount]="menu.badge" [nzDot]="menu.badge_dot || false"></nz-badge>
          </div>
          <ul class="bf-aside-menu" *ngIf="menu._type === 3">
            <li class="bf-aside-menu__item menu__item_leaf"
                *ngFor="let m of menu.children"
                routerLinkActive="bf-aside-menu__item_active"
            >
              <div class="bf-aside-menu__title">
                <!-- link -->
                <a class="bf-aside-menu__text" *ngIf="m._type === 1" [routerLink]="m.link" target="{{ m.target }}">
                  {{ m.text }}
                </a>
                <!-- external link -->
                <a class="bf-aside-menu__text" *ngIf="m._type === 2" href="{{ m.externalLink }}" target="{{ m.target }}">
                  {{m.text }}
                </a>
                <!-- has children -->
                <span class="bf-aside-menu__text" *ngIf="m._type === 3">
              {{ m.text }}
            </span>
                <nz-badge *ngIf="m.badge" [nzCount]="m.badge" [nzDot]="m.badge_dot || false"></nz-badge>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </ng-template>
  `
})
export class BfAsideComponent implements OnInit {
  menus$: Observable<Menu[]>;

  constructor(private menuService: BfMenuService) {}

  ngOnInit() {
    this.menus$ = this.menuService.menus$;
  }

  toggleOpen(menu: Menu) {
    this.menuService.toggleOpen(menu);
  }
}
