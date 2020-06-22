import { SharedModule } from './../../../shared/shared-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupRoutingModule } from './group-routing.module';
import { GroupComponent } from './group.component';


@NgModule({
  declarations: [GroupComponent],
  imports: [
    CommonModule,
    GroupRoutingModule,
    SharedModule
  ]
})
export class GroupModule { }
