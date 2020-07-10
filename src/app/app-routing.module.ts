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
            path: 'home',
            loadChildren: () =>
              import('./pages/home/home.module').then((m) => m.HomeModule),
          },
          {
            path: 'change-password',
            loadChildren: () =>
              import('./pages/change-password/change-password.module').then(
                (m) => m.ChangePasswordModule
              ),
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
            path: 'unit',
            canActivate: [TeacherGuard],
            loadChildren: () =>
              import('./pages/teacher/unit/unit.module').then(
                (m) => m.UnitModule
              ),
          },
          {
            path: 'share',
            canActivate: [TeacherGuard],
            loadChildren: () =>
              import('./pages/teacher/share-exam/share-exam.module').then(
                (m) => m.ShareExamModule
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
            path: 'database',
            loadChildren: () =>
              import(
                './pages/teacher/database-server/database-server.module'
              ).then((m) => m.DatabaseServerModule),
          },
          {
            path: 'exam',
            // canActivate:[TeacherGuard],
            loadChildren: () =>
              import('./pages/teacher/manage-exam/manage-exam.module').then(
                (m) => m.ManageExamModule
              ),
          },
          {
            path: '',
            redirectTo: '/home',
            pathMatch: 'full',
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
