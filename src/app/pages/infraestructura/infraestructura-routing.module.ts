import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfraestructuraPage } from './infraestructura.page';

const routes: Routes = [
  {
    path: '',
    component: InfraestructuraPage
  },
  {
    path: 'aula',
    loadChildren: () => import('./aula/aula.module').then( m => m.AulaPageModule)
  },
  {
    path: 'departamento',
    loadChildren: () => import('./departamento/departamento.module').then( m => m.DepartamentoPageModule)
  },
  {
    path: 'edificio',
    loadChildren: () => import('./edificio/edificio.module').then( m => m.EdificioPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfraestructuraPageRoutingModule {}
