import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageExamRoutingModule } from './manage-exam-routing.module';
import { ManageExamComponent } from './manage-exam.component';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  declarations: [ManageExamComponent],
  imports: [CommonModule, ManageExamRoutingModule, SharedModule],
})
export class ManageExamModule {}
