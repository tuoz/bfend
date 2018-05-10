import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

const COMPONENTS = [DashboardComponent];

@NgModule({
  imports: [SharedModule, DashboardRoutingModule],
  providers: [],
  declarations: [...COMPONENTS]
})
export class DashboardModule {}
