import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KnowledgeDetailPageRoutingModule } from './knowledge-detail-routing.module';

import { KnowledgeDetailPage } from './knowledge-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    KnowledgeDetailPageRoutingModule
  ],
  declarations: [KnowledgeDetailPage]
})
export class KnowledgeDetailPageModule {}
