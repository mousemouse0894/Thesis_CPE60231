import { EventsExamComponent } from './events-exam.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEventsComponent } from './add-events/add-events.component';
import { OldEventsComponent } from './old-events/old-events.component';

const routes: Routes = [
  {
    path: '',
    component: EventsExamComponent,
    children: [
      { path: 'add', component: AddEventsComponent },
      { path: 'old', component: OldEventsComponent },
      { path: '', redirectTo: '/events-exam/add' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsExamRoutingModule {}
