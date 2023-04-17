import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryDetailPageRoutingModule } from './inventory-detail-routing.module';

import { InventoryDetailPage } from './inventory-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InventoryDetailPageRoutingModule
  ],
  declarations: [InventoryDetailPage]
})
export class InventoryDetailPageModule {}
