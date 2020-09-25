import { ExamTestComponent } from './exam-test/exam-test.component';
import { EventsExamComponent } from './../../student/events-exam/events-exam.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: EventsExamComponent },
  { path: ':topicId', component: ExamTestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsExamRoutingModule {}
