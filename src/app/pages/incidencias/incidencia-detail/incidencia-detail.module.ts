import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidenciaDetailPageRoutingModule } from './incidencia-detail-routing.module';

import { IncidenciaDetailPage } from './incidencia-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidenciaDetailPageRoutingModule
  ],
  declarations: [IncidenciaDetailPage]
})
export class IncidenciaDetailPageModule {}
