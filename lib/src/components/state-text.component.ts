import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bf-state-text',
  template: `
    <ng-container [ngSwitch]="value">
      <nz-tag class="cursor-default" *ngSwitchCase="0" nzColor="green">正常</nz-tag>
      <nz-tag class="cursor-default" *ngSwitchCase="99" nzColor="#ccc">禁用</nz-tag>
      <span class="cursor-default" *ngSwitchDefault>{{value}}</span>
    </ng-container>
  `,
  styles: []
})
export class BfStateTextComponent implements OnInit {

  @Input() value;

  constructor() { }

  ngOnInit() {
  }

}
