import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'bf-page',
  template: `
    <ng-template #descTemplate>
      <ng-template [ngTemplateOutlet]="description"></ng-template>
    </ng-template>

    <div class="bf-page-title">
      <div class="bf-page-title__breadcrumb" *ngIf="breadcrumb">
        <ng-container *ngTemplateOutlet="breadcrumb"></ng-container>
      </div>
      <div class="bf-page-title__text">{{caption}}</div>
      <div class="bf-page-title__description" *ngIf="description">
        <ng-container *ngIf="isDescriptionString; else descTemplate">
          {{description}}
        </ng-container>
      </div>

      <ng-container *ngTemplateOutlet="extra"></ng-container>
    </div>

    <div class="bf-page-content">
      <ng-content></ng-content>
    </div>
  `
})
export class BfPageComponent {
  @Input() caption: string;

  private _description: string | TemplateRef<void>;
  isDescriptionString = true;

  @Input() extra: TemplateRef<void>;

  @Input() breadcrumb: TemplateRef<void>;

  @Input() set description(v) {
    this.isDescriptionString = !(v instanceof TemplateRef);
    this._description = v;
  }

  get description() {
    return this._description;
  }
}
