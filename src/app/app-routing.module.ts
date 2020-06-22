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
        path:'notfound',
        loadChildren: ()=>
        import('./pages/notfound/notfound.module').then((m)=> m.NotfoundModule),
      },
      {
        path:'forget-password',
        loadChildren:() =>
        import('./pages/forget-password/forget-password.module').then((m) => m.ForgetPasswordModule),
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
            path:'change-password',
            loadChildren:() =>
              import('./pages/change-password/change-password.module').then((m) => m.ChangePasswordModule)
          },
          {
            path:'clear-access',
            canActivate: [StudentGuard],
            loadChildren:() =>
            import('./pages/clearaccess/clearaccess.module').then((m) => m.ClearaccessModule),
          },
          {
            path:'group-student',
            canActivate:[StudentGuard],
            // canActivate:[TeacherGuard],
            loadChildren:()=>
            import('./pages/teacher/group-student/group-student.module').then((m)=>m.GroupStudentModule),
          },
          {
            path:'group',
            loadChildren:()=>
            import('./pages/student/group/group.module').then((m)=>m.GroupModule),
          },
          {
            path: '',
            redirectTo: '/home',
            pathMatch: 'full',
          },
        ],
      },
      {
        path:'**',
        loadChildren: ()=>
          import('./pages/notfound/notfound.module').then((m)=>m.NotfoundModule)
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
