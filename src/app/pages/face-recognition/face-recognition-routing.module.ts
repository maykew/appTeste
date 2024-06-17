import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaceRecognitionPage } from './face-recognition.page';

const routes: Routes = [
  {
    path: '',
    component: FaceRecognitionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaceRecognitionPageRoutingModule {}
