import { SharedModule } from './../../../shared/shared-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatabaseServerRoutingModule } from './database-server-routing.module';
import { DatabaseServerComponent } from './database-server.component';
import { QueryComponent } from './query/query.component';
import { ViewComponent } from './view/view.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [DatabaseServerComponent, QueryComponent, ViewComponent],
  imports: [
    CommonModule,
    DatabaseServerRoutingModule,
    SharedModule,
    NgxPaginationModule,
  ],
})
export class DatabaseServerModule {}
