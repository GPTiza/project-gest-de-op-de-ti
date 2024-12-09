import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EdificioPageRoutingModule } from './edificio-routing.module';

import { EdificioPage } from './edificio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EdificioPageRoutingModule
  ],
  declarations: [EdificioPage]
})
export class EdificioPageModule {}
