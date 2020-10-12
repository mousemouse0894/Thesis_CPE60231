import { EventsExamComponent } from './events-exam.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEventsComponent } from './add-events/add-events.component';
import { OldEventsComponent } from './old-events/old-events.component';
import { DetailEventsComponent } from './detail-events/detail-events.component';

const routes: Routes = [
  {
    path: '',
    component: EventsExamComponent,
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        children: [
          { path: '', component: AddEventsComponent },
          {
            path: ':examId/:groupId',
            component: DetailEventsComponent,
          },
          {
            path: ':examId/:groupId/:studentId',
            component: OldEventsComponent,
          },
        ],
      },
      { path: '', redirectTo: '/events-exam' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsExamRoutingModule {}
