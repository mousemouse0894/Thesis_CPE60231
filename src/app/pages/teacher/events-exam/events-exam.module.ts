import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsExamRoutingModule } from './events-exam-routing.module';
import { EventsExamComponent } from './events-exam.component';
import { AddEventsComponent } from './add-events/add-events.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared-module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OldEventsComponent } from './old-events/old-events.component';
import { DetailEventsComponent } from './detail-events/detail-events.component';
@NgModule({
  declarations: [EventsExamComponent, AddEventsComponent, OldEventsComponent, DetailEventsComponent],
  imports: [
    CommonModule,
    EventsExamRoutingModule,
    NgxPaginationModule,
    SharedModule,
    NgxMaterialTimepickerModule,
  ],
})
export class EventsExamModule {}
