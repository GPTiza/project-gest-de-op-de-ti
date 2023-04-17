import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KnowledgePage } from './knowledge.page';

const routes: Routes = [
  {
    path: '',
    component: KnowledgePage
  },
  {
    path: 'knowledge-detail',
    loadChildren: () => import('./knowledge-detail/knowledge-detail.module').then( m => m.KnowledgeDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnowledgePageRoutingModule {}
