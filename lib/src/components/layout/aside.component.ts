import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Menu, BfMenuService } from '../../menu.service';

@Component({
  selector: 'bf-aside',
  template: `
    <ng-container *ngFor="let m of menus$ | async">
      <ng-container *ngIf="m.group">
        <section class="group">
          <h2 class="group__title">{{m.text}}</h2>
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
      <ul class="menu">
        <li class="menu__item"
            routerLinkActive="menu__item--active"
            [ngClass]="{
        'menu__item--has-children': menu._type == 3,
        'menu__item--leaf': menu._type !== 3,
        'menu__item--explosed': menu._open && menu._type === 3,
        'menu__item--hidden': menu.hide
      }"
        >
          <div class="menu__title" (click)="toggleOpen(menu)">
            <i class="menu__icon {{menu.icon}}"></i>
            <!-- link -->
            <a class="menu__text" *ngIf="menu._type === 1" [routerLink]="menu.link" target="{{ menu.target }}">
              {{ menu.text }}
            </a>
            <!-- external link -->
            <a class="menu__text" *ngIf="menu._type === 2" href="{{ menu.externalLink }}" target="{{ menu.target }}">
              {{menu.text }}
            </a>
            <!-- has children -->
            <span class="menu__text" *ngIf="menu._type === 3">
          {{ menu.text }}
        </span>
            <nz-badge *ngIf="menu.badge" [nzCount]="menu.badge" [nzDot]="menu.badge_dot || false"></nz-badge>
          </div>
          <ul class="menu" *ngIf="menu._type === 3">
            <li class="menu__item menu__item--leaf"
                *ngFor="let m of menu.children"
                routerLinkActive="menu__item--active"
            >
              <div class="menu__title">
                <!-- link -->
                <a class="menu__text" *ngIf="m._type === 1" [routerLink]="m.link" target="{{ m.target }}">
                  {{ m.text }}
                </a>
                <!-- external link -->
                <a class="menu__text" *ngIf="m._type === 2" href="{{ m.externalLink }}" target="{{ m.target }}">
                  {{m.text }}
                </a>
                <!-- has children -->
                <span class="menu__text" *ngIf="m._type === 3">
              {{ m.text }}
            </span>
                <nz-badge *ngIf="m.badge" [nzCount]="m.badge" [nzDot]="m.badge_dot || false"></nz-badge>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </ng-template>
  `,
  styleUrls: ['./aside.component.less']
})
export class BfAsideComponent implements OnInit {
  menus$: Observable<Menu[]>;

  constructor(private menuService: BfMenuService) {
  }

  ngOnInit() {
    this.menus$ = this.menuService.menus$;
  }

  toggleOpen(menu: Menu) {
    this.menuService.toggleOpen(menu);
  }
}
