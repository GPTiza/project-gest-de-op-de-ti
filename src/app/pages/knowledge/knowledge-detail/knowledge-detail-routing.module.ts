import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KnowledgeDetailPage } from './knowledge-detail.page';

const routes: Routes = [
  {
    path: '',
    component: KnowledgeDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnowledgeDetailPageRoutingModule {}
