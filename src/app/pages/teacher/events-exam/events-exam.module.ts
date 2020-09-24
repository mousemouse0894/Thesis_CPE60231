import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsExamRoutingModule } from './events-exam-routing.module';
import { EventsExamComponent } from './events-exam.component';
import { AddEventsComponent } from './add-events/add-events.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared-module';
@NgModule({
  declarations: [EventsExamComponent, AddEventsComponent],
  imports: [
    CommonModule,
    EventsExamRoutingModule,
    NgxPaginationModule,
    SharedModule,
  ],
})
export class EventsExamModule {}
