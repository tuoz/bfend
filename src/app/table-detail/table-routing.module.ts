import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TableComponent } from './table.component';
import { TableProfileComponent } from './table-profile.component';

const routes: Route[] = [
  {
    path: 'index',
    component: TableComponent,
    data: {acl: 'table.detail.index'},
    pathMatch: 'full'
  },
  {
    path: 'show/:id',
    component: TableProfileComponent,
    data: {acl: 'table.detail.show'},
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableRoutingModule {}
