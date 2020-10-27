import { TeacherGuard } from './guards/teacher.guard';
import { StudentGuard } from './guards/student.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './components/default/default.component';
import { PrivateComponent } from './components/private/private.component';
import { CheckLoginGuard } from './guards/check-login.guard';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./pages/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'notfound',
        loadChildren: () =>
          import('./pages/notfound/notfound.module').then(
            (m) => m.NotfoundModule
          ),
      },
      {
        path: 'forget-password',
        loadChildren: () =>
          import('./pages/forget-password/forget-password.module').then(
            (m) => m.ForgetPasswordModule
          ),
      },
      {
        path: '',
        component: PrivateComponent,
        canActivate: [CheckLoginGuard],
        children: [
          {
            path: 'change-password',
            loadChildren: () =>
              import('./pages/change-password/change-password.module').then(
                (m) => m.ChangePasswordModule
              ),
          },
          {
            path: 'database',
            loadChildren: () =>
              import(
                './pages/teacher/database-server/database-server.module'
              ).then((m) => m.DatabaseServerModule),
          },
          {
            path: 'clear-access',
            canActivate: [TeacherGuard],
            loadChildren: () =>
              import('./pages/teacher/clearaccess/clearaccess.module').then(
                (m) => m.ClearaccessModule
              ),
          },
          {
            path: 'group-student',
            canActivate: [TeacherGuard],
            loadChildren: () =>
              import('./pages/teacher/group-student/group-student.module').then(
                (m) => m.GroupStudentModule
              ),
          },
          {
            path: 'exam-store',
            canActivate: [TeacherGuard],
            loadChildren: () =>
              import(`./pages/teacher/examstore/examstore.module`).then(
                (m) => m.ExamstoreModule
              ),
          },
          {
            path: 'events-exam',
            canActivate: [TeacherGuard],
            loadChildren: () =>
              import(`./pages/teacher/events-exam/events-exam.module`).then(
                (m) => m.EventsExamModule
              ),
          },
          {
            path: 'exam-set',
            canActivate: [TeacherGuard],
            loadChildren: () =>
              import(`./pages/teacher/exam-set/exam-set.module`).then(
                (m) => m.ExamSetModule
              ),
          },
          {
            path: 'group',
            canActivate: [StudentGuard],
            loadChildren: () =>
              import('./pages/student/group/group.module').then(
                (m) => m.GroupModule
              ),
          },
          {
            path: 'log',
            canActivate: [StudentGuard],
            loadChildren: () =>
              import('./pages/student/log-student/log-student.module').then(
                (m) => m.LogStudentModule
              ),
          },
          {
            path: 'events',
            canActivate: [StudentGuard],
            loadChildren: () =>
              import('./pages/student/events-exam/events-exam.module').then(
                (m) => m.EventsExamModule
              ),
          },
          {
            path: 'history-test',
            canActivate: [StudentGuard],
            loadChildren: () =>
              import('./pages/student/history-test/history-test.module').then(
                (m) => m.HistoryTestModule
              ),
          },

        ],
      },
      {
        path: '**',
        loadChildren: () =>
          import('./pages/notfound/notfound.module').then(
            (m) => m.NotfoundModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
