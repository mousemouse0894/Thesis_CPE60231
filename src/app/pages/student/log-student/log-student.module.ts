import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogStudentRoutingModule } from './log-student-routing.module';
import { LogStudentComponent } from './log-student.component';
import { SharedModule } from 'src/app/shared/shared-module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [LogStudentComponent],
  imports: [
    CommonModule,
    LogStudentRoutingModule,
    SharedModule,
    NgxPaginationModule,
  ],
})
export class LogStudentModule {}
