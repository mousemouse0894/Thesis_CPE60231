import { SharedModule } from './../../../shared/shared-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatabaseServerRoutingModule } from './database-server-routing.module';
import { DatabaseServerComponent } from './database-server.component';


@NgModule({
  declarations: [DatabaseServerComponent],
  imports: [
    CommonModule,
    DatabaseServerRoutingModule,
    SharedModule
  ]
})
export class DatabaseServerModule { }
