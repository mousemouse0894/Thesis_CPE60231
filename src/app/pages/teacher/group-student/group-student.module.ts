import { SharedModule } from './../../../shared/shared-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupStudentRoutingModule } from './group-student-routing.module';
import { GroupStudentComponent } from './group-student.component';

@NgModule({
  declarations: [GroupStudentComponent],
  imports: [CommonModule, GroupStudentRoutingModule, SharedModule],
})
export class GroupStudentModule {}
