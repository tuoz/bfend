import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BfendModule } from 'bfend';
import { LayoutComponent } from './layout.component';

const COMPONENTS = [
  LayoutComponent
];
const ENTRY_COMPONENTS = [];

const DIRECTIVES = [];
const PIPES = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    // 第三方
    BfendModule
  ],
  providers: [],
  declarations: [...COMPONENTS, ...DIRECTIVES, ...PIPES],
  entryComponents: [...ENTRY_COMPONENTS],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // 第三方
    BfendModule,
    // 业务级
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES
  ]
})
export class SharedModule {}
