import { Injectable } from '@angular/core';
import { registerPlugin, Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

import { RegisterWorkareaPage } from './../pages/register-workarea/register-workarea.page'; // Importe o componente

interface BackgroundGeolocationPlugin {
  addWatcher(options: {
    backgroundMessage: string;
    backgroundTitle: string;
    requestPermissions: boolean;
    stale: boolean;
    distanceFilter: number;
  }, callback: (location: any, error: any) => void): Promise<any>;

  removeWatcher(options: { id: string }): Promise<void>;

  openSettings(): Promise<void>;
}

const BackgroundGeolocation = Capacitor.isNativePlatform()
  ? registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation')
  : null; // No web, não precisamos registrar o plugin

@Injectable({
  providedIn: 'root',
})
export class BackgroundGeolocationService {
  private watcherId: string | undefined;
  private userLocationSubject = new BehaviorSubject<{ latitude: number; longitude: number }>({ latitude: 0, longitude: 0 });
  public userLocation$ = this.userLocationSubject.asObservable();

  private componentInstance: RegisterWorkareaPage |null= null; // Armazena a referência do componente
  private isInsideWorkArea: boolean = false;

  constructor() {}


  registerComponent(component: any) {
    this.componentInstance = component;
  }

  async addWatcher() {
    if (Capacitor.isNativePlatform()) {
      // Uso da funcionalidade nativa
      try {
        this.watcherId = await BackgroundGeolocation?.addWatcher(
          {
            backgroundMessage: 'O Aplicativo da VEPEMA está te rastreando mesmo em segundo plano. Sua localização será atualizada sempre que você se mover 10 Metros.',
            backgroundTitle: 'Você está sendo Rastreado.',
            requestPermissions: true,
            stale: false,
            distanceFilter: 1,
          },
          (location, error) => {
            if (error) {
              // Tratamento de erro
              return;
            }
  
            if (location && location.coords) {
              this.userLocationSubject.next({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });

              this.verifyLocation(location.coords.latitude, location.coords.longitude);
            }
          }
        );
        return this.watcherId;
      } catch (error) {
        console.error('Error adding watcher', error);
        return null;
      }
    } else {
      // Geolocalização na web
      if ('geolocation' in navigator) {
        navigator.geolocation.watchPosition(
          (position) => {
            this.userLocationSubject.next({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
      
            // Use position.coords ao invés de location.coords
            this.verifyLocation(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error('Error watching position', error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 10000, // Tempo máximo em cache antes de pedir a nova localização
          }
        );
        return 'web_watcher_active';  // Retorna uma string indicando que o watcher está ativo no navegador
      } else {
        console.error('Geolocation is not supported by this browser.');
        return null;  // Retorna null se a geolocalização não for suportada
      }
    }
  }
  
  // Método para verificar se o usuário está dentro da área de trabalho
  verifyLocation(latitude: number, longitude: number) {

    if(this.componentInstance==null){console.log("Componente Subscrito nulo");return;}

    const isInsideWorkArea = this.componentInstance.isMarkerInWorkArea(latitude, longitude);
    
    if (isInsideWorkArea && !this.isInsideWorkArea) {
      this.isInsideWorkArea = true;
      this.componentInstance.onEnterWorkArea();
    } else if (!isInsideWorkArea && this.isInsideWorkArea) {
      this.isInsideWorkArea = false;
      this.componentInstance.onExitWorkArea();
    }
  }
  

  async removeWatcher() {
    if (Capacitor.isNativePlatform()) {
      if (this.watcherId) {
        try {
          await BackgroundGeolocation?.removeWatcher({ id: this.watcherId });
          this.watcherId = undefined;
        } catch (error) {
          console.error('Error removing watcher', error);
        }
      }
    } else {
      console.warn('Geolocation watcher cannot be removed on web.');
    }
  }

  async openSettings() {
    if (Capacitor.isNativePlatform()) {
      try {
        await BackgroundGeolocation?.openSettings();
      } catch (error) {
        console.error('Error opening settings', error);
      }
    } else {
      console.warn('Cannot open settings on web.');
    }
  }

  async getUserLocation() {
    const currentLocation = this.userLocationSubject.getValue();
    console.log(currentLocation);
    if (currentLocation.latitude === 0 && currentLocation.longitude === 0) {
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
          this.userLocationSubject.next(newLocation); // Atualiza a localização
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
                  this.userLocationSubject.next(newLocation); // Atualiza a localização
                  resolve(newLocation);
                },
                (error) => {
                  console.error('Error getting location', error);
                  resolve(currentLocation); // Retorna a localização padrão em caso de erro
                },
                { enableHighAccuracy: true }
              );
            } else {
              console.error('Geolocation is not supported by this browser.');
              resolve(currentLocation); // Retorna a localização padrão
            }
          });
        }
      } catch (error) {
        console.error('Error getting user location', error);
        return currentLocation;
      }
    } else {
      return currentLocation; // Retorna a última localização conhecida
    }
  }

  async requestPermissions() {
    if (Capacitor.isNativePlatform()) {
      return await Geolocation.requestPermissions();
    } else {
      // Na web, não há permissão explícita a ser solicitada via código
      return Promise.resolve({ location: 'granted', scope: 'unlimited' });
    }
  }
}
