import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterWorkareaPageRoutingModule } from './register-workarea-routing.module';

import { NotificationService } from 'src/app/services/notification.service';

import { RegisterWorkareaPage } from './register-workarea.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterWorkareaPageRoutingModule
  ],
  declarations: [RegisterWorkareaPage]
})
export class RegisterWorkareaPageModule {}
