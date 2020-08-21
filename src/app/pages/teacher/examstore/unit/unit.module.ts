import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitRoutingModule } from './unit-routing.module';
import { UnitComponent } from './unit.component';
import { SharedModule } from 'src/app/shared/shared-module';


@NgModule({
  declarations: [UnitComponent],
  imports: [
    CommonModule,
    UnitRoutingModule,
    SharedModule
  ]
})
export class UnitModule { }
