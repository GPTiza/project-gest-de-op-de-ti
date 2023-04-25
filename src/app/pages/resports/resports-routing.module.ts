import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResportsPage } from './resports.page';

const routes: Routes = [
  {
    path: '',
    component: ResportsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResportsPageRoutingModule {}
