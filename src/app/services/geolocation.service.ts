import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';
import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';



import { WorkareaNotificationService } from 'src/app/services/workarea-notification.service';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private lastLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 };

  constructor(public notificationService: WorkareaNotificationService) {
    this.startBackgroundGeolocation();
  }

  private async startBackgroundGeolocation() {
    try {
      await BackgroundGeolocation.addWatcher(
        {
          requestPermissions: true,
          stale: false,
          distanceFilter: 10, // Atualiza a cada 10 metros
          backgroundMessage: 'O aplicativo está usando sua localização em segundo plano.',
          backgroundTitle: 'Localização em segundo plano ativa',
        },
        (location, error) => {
          if (error) {
            if (error.code === 'NOT_AUTHORIZED') {
              if (window.confirm('Você precisa habilitar permissões de localização para que o aplicativo funcione corretamente. Deseja abrir as configurações agora?')) {
                BackgroundGeolocation.openSettings();
              }
            }
            return console.error(error);
          }
  
          this.lastLocation = {
            latitude: location?.latitude ?? 0,
            longitude: location?.longitude ?? 0,
          };
          
          // Enviar uma notificação quando a localização for atualizada

          const now = new Date();
          const hours = now.getHours().toString().padStart(2, '0'); // Formata para ter dois dígitos
          const minutes = now.getMinutes().toString().padStart(2, '0'); // Formata para ter dois dígitos

          this.notificationService.sendCustomNotification(
            'Geolocalização Atualizada',
            `Localização: (${this.lastLocation.latitude}, ${this.lastLocation.longitude}) Hora: ${hours}:${minutes}`
          );
          console.log('Localização atualizada:', this.lastLocation);
        }
      );
      console.log('Background Geolocation configurado');
    } catch (error) {
      console.error('Erro ao configurar Background Geolocation', error);
    }
  }

  getUserLocation() {
    return this.lastLocation;
  }
}