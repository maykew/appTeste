import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BackgroundRunner } from '@capacitor/background-runner';
import { registerPlugin } from '@capacitor/core';
import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';

import { GeolocationService } from 'src/app/services/geolocation.service';
import { MapService } from 'src/app/services/map.service';
import { WorkareaNotificationService } from 'src/app/services/workarea-notification.service';
import { configureMarkerIconOptions } from 'src/app/utils/marker-config';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');

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
  private wasInsideWorkArea: boolean = false;

  constructor(
    public platform: Platform,
    @Inject(GeolocationService) public geolocationService: GeolocationService,
    public mapService: MapService,
    public notificationService: WorkareaNotificationService,
    public router: Router
  ) {
    if (this.platform.is('android')) {
      Geolocation.requestPermissions();
    }
  }

  async ngOnInit() {
    const permission = await this.notificationService.requestPermissions();
    const permissions = await BackgroundRunner.requestPermissions({
      apis: ['notifications', 'geolocation'],
    });

    configureMarkerIconOptions();
    this.userLocation = this.geolocationService.getUserLocation();
    this.mapService.initMap(this.userLocation.latitude, this.userLocation.longitude, this.workareapolygonPoints);

    const map = this.mapService.getMap();

    if (map) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        this.onMapClick(e);
      });
    }

    this.startUpdatingUserLocation();

    this.registerMyCustomEvent();
    
    this.notifications = this.notificationService.getNotifications();
  }

  async registerMyCustomEvent() {

    this.notificationService.sendCustomNotification('Registrando', "evento em segundo plano sendo registrado...");
    addEventListener('myCustomEvent', this.handleMyCustomEvent.bind(this),{ once: false});
    await BackgroundRunner.dispatchEvent({
      label: 'com.capacitor.background.check',
      event: 'MyCustomEvent',
      details: {},
    });
  }

  handleMyCustomEvent(event: any) {
    this.notificationService.sendCustomNotification('myCustomEvent triggered:', "event");
    this.startUpdatingUserLocation();
  }

  async onClickBaterPonto() {
    const permission = await this.notificationService.requestPermissions();
    if (permission.display === 'granted') {
      const isInside = this.isMarkerInWorkAreaForeground(this.userLocation.latitude, this.userLocation.longitude);
      this.notificationService.sendNotification(isInside, this.userLocation.latitude, this.userLocation.longitude);
    } else {
      this.notificationService.showAlert('Permissão Negada', 'Você precisa permitir notificações.');
    }
  }

  ngOnDestroy() {
    clearInterval(this.updateInterval);
  }

  startUpdatingUserLocation() {
    this.updateInterval = setInterval(() => {
      this.userLocation = this.geolocationService.getUserLocation();
      this.mapService.moveUserMarker(this.userLocation.latitude, this.userLocation.longitude);
  
      // Utiliza a função de primeiro plano
      const isInsideWorkArea = this.isMarkerInWorkAreaForeground(this.userLocation.latitude, this.userLocation.longitude);
  
      if (isInsideWorkArea !== this.wasInsideWorkArea) {
        this.notificationService.sendNotification(isInsideWorkArea, this.userLocation.latitude, this.userLocation.longitude);
        this.wasInsideWorkArea = isInsideWorkArea;
      }
    }, 5000);
  }

  isMarkerInWorkAreaForeground(latitude?: number, longitude?: number): boolean {
    if (latitude === undefined || longitude === undefined) {
      return false;
    }
  
    this.userLocation = { latitude, longitude };
  
    // Notificação para indicar que a função de foreground está sendo chamada
    this.notificationService.sendCustomNotification('Foreground Check', 'Verificando se o usuário está na área de trabalho (tarefa em primeiro plano).');
  
    return this.isPointInPolygon(this.userLocation, this.workareapolygonPoints);
  }

  isMarkerInWorkArea(latitude?: number, longitude?: number): boolean {
    if (latitude === undefined || longitude === undefined) {
      return false;
    }

    this.userLocation = { latitude, longitude };
    this.notificationService.sendCustomNotification('Background Check', 'Verificando se o usuário está na área de trabalho (tarefa em segundo plano).');
    return this.isPointInPolygon(this.userLocation, this.workareapolygonPoints);
  }

  isPointInPolygon(userLocation: { latitude: number, longitude: number }, polygon: L.LatLngExpression[]): boolean {
    let x = userLocation.longitude, y = userLocation.latitude;

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = (polygon[i] as any).lng ?? (polygon[i] as [number, number])[1];
      const yi = (polygon[i] as any).lat ?? (polygon[i] as [number, number])[0];
      const xj = (polygon[j] as any).lng ?? (polygon[j] as [number, number])[1];
      const yj = (polygon[j] as any).lat ?? (polygon[j] as [number, number])[0];

      let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  }

  onMapClick(e: L.LeafletMouseEvent) {
    const latlng = e.latlng;
    this.workareapolygonPoints.push([latlng.lat, latlng.lng]);
    this.updateWorkareaPolygon(this.workareapolygonPoints);
  }

  updateWorkareaPolygon(points: L.LatLngExpression[]) {
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
}