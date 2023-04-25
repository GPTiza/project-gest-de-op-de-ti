import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidenciaDetailPage } from './incidencia-detail.page';

const routes: Routes = [
  {
    path: '',
    component: IncidenciaDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidenciaDetailPageRoutingModule {}
