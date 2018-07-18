import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { BfAuthGuard } from 'bfend';
import { LayoutComponent } from './shared/layout.component';

const routes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      // 仪表盘
      {
        path: 'dashboard',
        canLoad: [BfAuthGuard],
        data: {acl: 'dashboard.*'},
        canActivateChild: [BfAuthGuard],
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'table/basic',
        data: {acl: 'table.basic.*'},
        canActivateChild: [BfAuthGuard],
        loadChildren: './table/table.module#TableModule',
      },
      {
        path: 'table/detail',
        data: {acl: 'table.detail.*'},
        canActivateChild: [BfAuthGuard],
        loadChildren: './table-detail/table.module#TableModule',
      }
    ]
  },
  {path: 'login', component: LoginComponent, pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutesModule {
}
