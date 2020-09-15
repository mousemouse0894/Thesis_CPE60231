import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamSetComponent } from './exam-set.component';
import { ViewComponent } from './view/view.component';
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: '',
    component: ExamSetComponent,
    children: [
      {
        path: 'view',
        component: ViewComponent,
      },
      {
        path: 'update',
        component: UpdateComponent,
      },
      {
        path: 'update/:data',
        component: UpdateComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/exam-set/view',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamSetRoutingModule {}
