import { SharedModule } from './../../../shared/shared-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageExamRoutingModule } from './manage-exam-routing.module';
import { ManageExamComponent } from './manage-exam.component';


@NgModule({
  declarations: [ManageExamComponent],
  imports: [
    CommonModule,
    ManageExamRoutingModule,
    SharedModule
  ]
})
export class ManageExamModule { }
