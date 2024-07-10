import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    //path:'',
    path: 'register-face',
    loadChildren: () => import('./pages/register-face/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'identify-faces',
    loadChildren: () => import('./pages/identify-faces/identify-faces.module').then( m => m.IdentifyFacesPageModule)
  },
  {
    path: 'face-recognition',
    loadChildren: () => import('./pages/face-recognition/face-recognition.module').then( m => m.FaceRecognitionPageModule)
  },
  {
    //path: 'register-workarea',
    path:'',
    loadChildren: () => import('./pages/register-workarea/register-workarea.module').then( m => m.RegisterWorkareaPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
