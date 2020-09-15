import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsExamRoutingModule } from './events-exam-routing.module';
import { EventsExamComponent } from './events-exam.component';
import { AddEventsComponent } from './add-events/add-events.component';


@NgModule({
  declarations: [EventsExamComponent, AddEventsComponent],
  imports: [
    CommonModule,
    EventsExamRoutingModule
  ]
})
export class EventsExamModule { }
