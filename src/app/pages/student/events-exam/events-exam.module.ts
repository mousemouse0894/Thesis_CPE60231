import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsExamRoutingModule } from './events-exam-routing.module';
import { EventsExamComponent } from './events-exam.component';
import { ExamTestComponent } from './exam-test/exam-test.component';
import { SharedModule } from 'src/app/shared/shared-module';

@NgModule({
  declarations: [EventsExamComponent, ExamTestComponent],
  imports: [CommonModule, EventsExamRoutingModule, SharedModule],
})
export class EventsExamModule {}
