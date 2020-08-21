import { NgxPaginationModule } from 'ngx-pagination';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamstoreRoutingModule } from './examstore-routing.module';
import { ExamstoreComponent } from './examstore.component';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  declarations: [ExamstoreComponent],
  imports: [
    CommonModule,
    ExamstoreRoutingModule,
    SharedModule,
    NgxPaginationModule,
  ],
})
export class ExamstoreModule {}
