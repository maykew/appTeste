import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

// Importando os serviços
import { BackgroundGeolocationService } from './services/geolocation.service';
import { MapService } from './services/map.service';
import { WorkareaNotificationService } from './services/workarea-notification.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BackgroundGeolocationService,  // Incluindo o serviço de geolocalização
    MapService,  // Incluindo o serviço de mapas
    WorkareaNotificationService  // Incluindo o serviço de notificações
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}