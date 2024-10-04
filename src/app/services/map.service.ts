import * as L from 'leaflet';
import { Injectable } from '@angular/core';
import { LatLngExpression } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map: L.Map | undefined;
  userMarker: L.Marker | undefined;
  workareapolygon: L.Polygon | undefined;

  initMap(latitude: number, longitude: number, workareapolygonPoints: LatLngExpression[]) {
    this.map = L.map('map').setView([latitude, longitude], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.userMarker = L.marker([latitude, longitude])
      .addTo(this.map)
      .bindPopup('Você está aqui!')
      .openPopup();

    this.workareapolygon = L.polygon(workareapolygonPoints, {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.2,
    }).addTo(this.map);
  }

  getMap(): L.Map | undefined {
    return this.map;
  }

  updateWorkareaPolygon(points: L.LatLngExpression[]) {
    if (this.workareapolygon) {
      this.map?.removeLayer(this.workareapolygon);
    }
    this.workareapolygon = L.polygon(points, {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.2,
    });
  
    // Garante que o mapa está definido antes de adicionar a camada
    if (this.map) {
      this.workareapolygon.addTo(this.map);
    } else {
      console.error('Mapa não está inicializado.');
    }
  }

  moveUserMarker(latitude: number, longitude: number) {
    if (this.userMarker) {
      console.log("Movendo o user marker para: "+latitude+"/"+ longitude);
      this.userMarker.setLatLng([latitude, longitude]);
      this.userMarker.openPopup();
    }
  }
}
