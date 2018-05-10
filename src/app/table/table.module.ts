import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TableRoutingModule } from './table-routing.module';
import { TableComponent } from './table.component';
import { TableEditComponent } from './table-edit.component';

const COMPONENTS = [TableComponent, TableEditComponent];
const ENTRY_COMPONENTS = [TableEditComponent];

@NgModule({
  imports: [SharedModule, TableRoutingModule],
  providers: [],
  declarations: COMPONENTS,
  entryComponents: ENTRY_COMPONENTS
})
export class TableModule {}
