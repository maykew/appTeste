import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdentifyFacesPage } from './identify-faces.page';

const routes: Routes = [
  {
    path: '',
    component: IdentifyFacesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentifyFacesPageRoutingModule {}
