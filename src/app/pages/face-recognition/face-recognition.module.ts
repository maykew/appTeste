import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaceRecognitionPageRoutingModule } from './face-recognition-routing.module';

import { FaceRecognitionPage } from './face-recognition.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaceRecognitionPageRoutingModule
  ],
  declarations: [FaceRecognitionPage]
})
export class FaceRecognitionPageModule {}
