import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdentifyFacesPageRoutingModule } from './identify-faces-routing.module';

import { IdentifyFacesPage } from './identify-faces.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IdentifyFacesPageRoutingModule
  ],
  declarations: [IdentifyFacesPage]
})
export class IdentifyFacesPageModule {}
