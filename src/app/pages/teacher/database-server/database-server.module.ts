import { SharedModule } from './../../../shared/shared-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatabaseServerRoutingModule } from './database-server-routing.module';
import { DatabaseServerComponent } from './database-server.component';
import { QueryComponent } from './query/query.component';
import { ViewComponent } from './view/view.component';


@NgModule({
  declarations: [DatabaseServerComponent, QueryComponent, ViewComponent],
  imports: [
    CommonModule,
    DatabaseServerRoutingModule,
    SharedModule
  ]
})
export class DatabaseServerModule { }
