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
            path: '',
            redirectTo: '/home',
            pathMatch: 'full',
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
