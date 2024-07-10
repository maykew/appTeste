import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterWorkareaPage } from './register-workarea.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterWorkareaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterWorkareaPageRoutingModule {}
