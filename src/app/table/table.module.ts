import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TableProfileComponent } from './table-profile.component';
import { TableRoutingModule } from './table-routing.module';
import { TableApi } from './table.api';
import { TableComponent } from './table.component';
import { TableEditComponent } from './table-edit.component';

const COMPONENTS = [TableComponent, TableEditComponent, TableProfileComponent];
const ENTRY_COMPONENTS = [TableEditComponent];

@NgModule({
  imports: [SharedModule, TableRoutingModule],
  providers: [TableApi],
  declarations: COMPONENTS,
  entryComponents: ENTRY_COMPONENTS
})
export class TableModule {}
