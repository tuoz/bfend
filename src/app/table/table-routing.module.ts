import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TableProfileComponent } from './table-profile.component';

import { TableComponent } from './table.component';

const routes: Route[] = [
  {
    path: '',
    component: TableComponent,
    data: {acl: 'table.index', 'keep_alive': true},
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: TableProfileComponent,
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
