import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamstoreComponent } from './examstore.component';

const routes: Routes = [
  {
    path: '',
    component: ExamstoreComponent,
    children: [
      {
        path: 'manage-unit',
        loadChildren: () =>
          import(`./unit/unit.module`).then((m) => m.UnitModule),
      },
      {
        path: 'share-exam',
        loadChildren: () =>
          import(`./share-exam/share-exam.module`).then(
            (m) => m.ShareExamModule
          ),
      },
      {
        path: 'manage-exam',
        loadChildren: () =>
          import(`./manage-exam/manage-exam.module`).then(
            (m) => m.ManageExamModule
          ),
      },
      {
        path: '',
        redirectTo: '/exam-store/manage-exam',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamstoreRoutingModule {}
