import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { LatLngExpression } from 'leaflet';
import { AlertController, Platform } from '@ionic/angular';
import { LoadingController, NavController } from '@ionic/angular';

import { NavParamsService } from 'src/app/services/nav-params.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LocalNotifications } from '@capacitor/local-notifications';

import { GeolocationService } from 'src/app/services/geolocation.service';
import { MapService } from 'src/app/services/map.service';
import { WorkareaNotificationService } from 'src/app/services/workarea-notification.service';
import { configureMarkerIconOptions } from 'src/app/utils/marker-config';

@Component({
  selector: 'app-register-workarea',
  templateUrl: './register-workarea.page.html',
  styleUrls: ['./register-workarea.page.scss'],
})
export class RegisterWorkareaPage implements OnInit, OnDestroy {
  userLocation = { latitude: 0, longitude: 0 };
  workareapolygonPoints: L.LatLngExpression[] = [];
  workareapolygon: L.Polygon | undefined;
  updateInterval: any;
  public workareaname: string = '';  // Definir o campo workareaname
  public notifications: string[] = []; 
  watchId: any;
  
  constructor(
    public platform: Platform,
    public geolocationService: GeolocationService,
    public mapService: MapService,
    public notificationService: WorkareaNotificationService,
    public router: Router
  ) {
    if (this.platform.is('android')) {
      Geolocation.requestPermissions();
    }
  }


  async ngOnInit() {
    configureMarkerIconOptions();
    this.userLocation = await this.geolocationService.getUserLocation();
    this.mapService.initMap(this.userLocation.latitude, this.userLocation.longitude, this.workareapolygonPoints);
  
    const map = this.mapService.getMap();
  
    if (map) {  // Verificação para garantir que o mapa existe
      // Adicionar listener de clique no mapa
      map.on('click', (e: L.LeafletMouseEvent) => {
        this.onMapClick(e);  // Chama a função quando o mapa é clicado
      });
    }
  
    this.notifications = this.notificationService.getNotifications();
    this.startWatchingUserLocation();  // Iniciar o acompanhamento contínuo da localização
  }

  async onClickBaterPonto() {
    const permission = await this.notificationService.requestPermissions();
    if (permission.display === 'granted') {
      const isInside = this.isMarkerInWorkArea(this.userLocation.latitude, this.userLocation.longitude);
      this.notificationService.sendNotification(isInside, this.userLocation.latitude, this.userLocation.longitude);
    } else {
      this.notificationService.showAlert('Permissão Negada', 'Você precisa permitir notificações.');
    }
  }

  ngOnDestroy() {
    this.stopWatchingUserLocation();  // Parar o acompanhamento contínuo da localização
  }


  startWatchingUserLocation() {
    this.watchId = Geolocation.watchPosition({}, (position, err) => {
      if (position) {
        this.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.mapService.moveUserMarker(this.userLocation.latitude, this.userLocation.longitude);
      }
      if (err) {
        console.error('Erro ao acompanhar a posição: ', err);
      }
    });
  }

  stopWatchingUserLocation() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }

  
  isMarkerInWorkArea(latitude?: number, longitude?: number): boolean {
    if (!latitude || !longitude) {
      return false;
    }

    this.userLocation = { latitude, longitude };
    return this.isPointInPolygon(this.userLocation, this.workareapolygonPoints);
  }

  isPointInPolygon(userLocation: { latitude: number, longitude: number }, polygon: LatLngExpression[]): boolean {
    let x = userLocation.longitude, y = userLocation.latitude;

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = (polygon[i] as any).lng ?? (polygon[i] as [number, number])[1];
      const yi = (polygon[i] as any).lat ?? (polygon[i] as [number, number])[0];
      const xj = (polygon[j] as any).lng ?? (polygon[j] as [number, number])[1];
      const yj = (polygon[j] as any).lat ?? (polygon[j] as [number, number])[0];

      let intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }



  onMapClick(e: L.LeafletMouseEvent) {
    const latlng = e.latlng; // Obter coordenadas do clique
    this.workareapolygonPoints.push([latlng.lat, latlng.lng]); // Adicionar ao array de pontos do polígono

    // Atualizar o polígono no mapa
    this.updateWorkareaPolygon(this.workareapolygonPoints);
  }

  // Atualizar o polígono desenhado no mapa
  updateWorkareaPolygon(points: LatLngExpression[]) {
    const map = this.mapService.getMap();
  
    if (map && this.workareapolygon) {
      map.removeLayer(this.workareapolygon);  // Aqui, o 'map' é garantido como 'L.Map'
    }
  
    if (map) {  // Verificação para garantir que o mapa existe
      this.workareapolygon = L.polygon(points, {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.2,
      }).addTo(map);  // Agora o 'map' é seguro para uso
    }
  }

}
