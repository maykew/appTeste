import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocalizationMapPageRoutingModule } from './localization-map-routing.module';

import { LocalizationMapPage } from './localization-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocalizationMapPageRoutingModule
  ],
  declarations: [LocalizationMapPage]
})
export class LocalizationMapPageModule {}
