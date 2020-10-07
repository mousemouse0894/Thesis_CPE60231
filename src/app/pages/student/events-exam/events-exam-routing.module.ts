import { ExamTestComponent } from './exam-test/exam-test.component';
import { EventsExamComponent } from './../../student/events-exam/events-exam.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { EventsOldComponent } from './events-old/events-old.component';

const routes: Routes = [
  {
    path: '',
    component: EventsExamComponent,
    children: [
      { path: 'list', component: EventsComponent },
      { path: 'old', component: EventsOldComponent },
      { path: '', redirectTo: '/events/list', pathMatch: 'full' },
    ],
  },
  { path: ':topicId', component: ExamTestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsExamRoutingModule {}
