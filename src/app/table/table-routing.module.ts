import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { TableComponent } from './table.component';

const routes: Route[] = [
  {
    path: '',
    component: TableComponent,
    data: {acl: 'table.index'},
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableRoutingModule {

}
