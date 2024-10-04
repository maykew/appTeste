import { Injectable } from '@angular/core';
import { registerPlugin, Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

import { WorkareaNotificationService } from 'src/app/services/workarea-notification.service';


interface BackgroundGeolocationPlugin {

}

const BackgroundGeolocation = Capacitor.isNativePlatform()
  ? registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation')
  : null; // No web, não precisamos registrar o plugin

@Injectable({
  providedIn: 'root',
})
export class BackgroundGeolocationService {

  constructor(
    public notificationService: WorkareaNotificationService
    ) {}

    



  

  async getUserLocation() {
    try {
      if (Capacitor.isNativePlatform()) {
        // Localização nativa
        const coordinates = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
        });
        const newLocation = {
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
        };
        // this.notificationService.showAlert("FIRST LOCATION:"+newLocation.longitude+"/"+newLocation.latitude,"native");
        return newLocation;
  
      } else {
        // Localização da web
        return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const newLocation = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                // this.notificationService.showAlert("FIRST LOCATION:"+newLocation.longitude+"/"+newLocation.latitude,"web");
                resolve(newLocation);
              },
              (error) => {
                console.error('Error getting location', error);
                // Retorna uma localização padrão ou a última conhecida em caso de erro
                resolve({latitude:0,longitude:0});
              },
              { enableHighAccuracy: true }
            );
          } else {
            console.error('Geolocation is not supported by this browser.');
            // Retorna uma localização padrão ou a última conhecida
            resolve({latitude:0,longitude:0});
          }
        });
      }
    } catch (error) {
      console.error('Error getting user location', error);
      // Retorna a última localização conhecida em caso de erro
      return({latitude:0,longitude:0});
    }
  }

  async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
      const permission = await Geolocation.requestPermissions();
      console.log('Geolocation permission:', permission);
      return permission;
    } else {
      // Na web, não há permissão explícita a ser solicitada via código
      return Promise.resolve({ location: 'granted', scope: 'unlimited' });
    }
  }

}
