import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { LatLngExpression } from 'leaflet';
import { Platform } from '@ionic/angular';

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
  public workareaname: string = '';
  public notifications: string[] = [];
  private isInsideWorkArea: boolean = false;  // Estado para verificar se o usuário está dentro ou fora

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

    if (map) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        this.onMapClick(e);
      });
    }

    this.startUpdatingUserLocation();
    this.notifications = this.notificationService.getNotifications();
  }

  ngOnDestroy() {
    clearInterval(this.updateInterval);
  }

  startUpdatingUserLocation() {
    this.updateInterval = setInterval(async () => {
      this.userLocation = await this.geolocationService.getUserLocation();
      this.mapService.moveUserMarker(this.userLocation.latitude, this.userLocation.longitude);

      const isNowInside = this.isMarkerInWorkArea(this.userLocation.latitude, this.userLocation.longitude);

      if (isNowInside && !this.isInsideWorkArea) {
        // Usuário entrou na workarea
        this.isInsideWorkArea = true;
        await this.onEnterWorkArea();
      } else if (!isNowInside && this.isInsideWorkArea) {
        // Usuário saiu da workarea
        this.isInsideWorkArea = false;
        await this.onExitWorkArea();
      }
    }, 5000); // Atualiza a cada 5 segundos
  }

  async onEnterWorkArea() {
    const permission = await this.notificationService.requestPermissions();
    if  (permission.display === 'granted') {
      console.log("Granted");

      const timestamp = new Date();
      const hours = timestamp.getHours().toString().padStart(2, '0');
      const minutes = timestamp.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      this.notificationService.sendNotification(
        true,
        this.userLocation.latitude,
        this.userLocation.longitude,
        'Você entrou na área de trabalho. Ponto registrado automaticamente. \nHorário:' + formattedTime
      );

    } else {
      this.notificationService.showAlert('Permissão Negada', 'Você precisa permitir notificações.');
    }
  }

  async onExitWorkArea() {
    const permission = await this.notificationService.requestPermissions();
    if (permission.display === 'granted') {
      console.log("Granted");

      const timestamp = new Date();
      const hours = timestamp.getHours().toString().padStart(2, '0');
      const minutes = timestamp.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      this.notificationService.sendNotification(false, this.userLocation.latitude, this.userLocation.longitude, 'Você saiu da área de trabalho. Horário:'+formattedTime);
    } else {
      this.notificationService.showAlert('Permissão Negada', 'Você precisa permitir notificações.');
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
    const latlng = e.latlng;
    this.workareapolygonPoints.push([latlng.lat, latlng.lng]);

    this.updateWorkareaPolygon(this.workareapolygonPoints);
  }

  updateWorkareaPolygon(points: LatLngExpression[]) {
    const map = this.mapService.getMap();

    if (map && this.workareapolygon) {
      map.removeLayer(this.workareapolygon);
    }

    if (map) {
      this.workareapolygon = L.polygon(points, {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.2,
      }).addTo(map);
    }
  }

  async onClickBaterPonto() {
    const permission = await this.notificationService.requestPermissions();
    
    if (permission.display === 'granted') {
      console.log("Granted");
      const isInside = this.isMarkerInWorkArea(this.userLocation.latitude, this.userLocation.longitude);
      
      const timestamp = new Date();
      const hours = timestamp.getHours().toString().padStart(2, '0');
      const minutes = timestamp.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      
      this.notificationService.sendNotification(isInside, this.userLocation.latitude, this.userLocation.longitude,"Ponto Batido  Horário:"+formattedTime);
    } else {
      this.notificationService.showAlert('Permissão Negada', 'Você precisa permitir notificações.');
    }
  }

}

