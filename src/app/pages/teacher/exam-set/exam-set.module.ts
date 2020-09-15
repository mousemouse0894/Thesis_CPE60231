import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamSetRoutingModule } from './exam-set-routing.module';
import { ExamSetComponent } from './exam-set.component';
import { ViewComponent } from './view/view.component';
import { UpdateComponent } from './update/update.component';
import { SharedModule } from 'src/app/shared/shared-module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [ExamSetComponent, ViewComponent, UpdateComponent],
  imports: [
    CommonModule,
    ExamSetRoutingModule,
    SharedModule,
    NgxPaginationModule,
  ],
})
export class ExamSetModule {}
