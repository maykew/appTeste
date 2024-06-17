import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'identify-faces',
    loadChildren: () => import('./pages/identify-faces/identify-faces.module').then( m => m.IdentifyFacesPageModule)
  },
  {
    path: 'face-recognition',
    loadChildren: () => import('./pages/face-recognition/face-recognition.module').then( m => m.FaceRecognitionPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
