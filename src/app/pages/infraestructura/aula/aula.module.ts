import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AulaPageRoutingModule } from './aula-routing.module';

import { AulaPage } from './aula.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AulaPageRoutingModule
  ],
  declarations: [AulaPage]
})
export class AulaPageModule {}
