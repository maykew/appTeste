import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalizationMapPage } from './localization-map.page';

const routes: Routes = [
  {
    path: '',
    component: LocalizationMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalizationMapPageRoutingModule {}
