import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResportsPageRoutingModule } from './resports-routing.module';

import { ResportsPage } from './resports.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResportsPageRoutingModule
  ],
  declarations: [ResportsPage]
})
export class ResportsPageModule {}
