import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClearaccessRoutingModule } from './clearaccess-routing.module';
import { ClearaccessComponent } from './clearaccess.component';


@NgModule({
  declarations: [ClearaccessComponent],
  imports: [
    CommonModule,
    ClearaccessRoutingModule
  ]
})
export class ClearaccessModule { }
