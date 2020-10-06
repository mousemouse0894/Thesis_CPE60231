import { DatabaseServerComponent } from './database-server.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QueryComponent } from './query/query.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '',
    component: DatabaseServerComponent,
    children: [
      { path: 'view', component: ViewComponent },
      { path: 'query', component: QueryComponent },
      { path: '', redirectTo: '/database/view', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatabaseServerRoutingModule {}
