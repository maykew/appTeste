


import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-localization-map',
  templateUrl: './localization-map.page.html',
  styleUrls: ['./localization-map.page.scss'],
})
export class LocalizationMapPage implements OnInit {
  map: L.Map | undefined;
  userMarker: L.Marker | undefined;
  workareaMarker:  L.Marker | undefined;
  workareaCircle: L.Circle | undefined;
  updateInterval: any;
  workareaSize: number = 200; //em metros
  

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadMap();
    this.startUpdatingUserLocation();
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  async updateUserLocation() {
    const userLocation = await this.getUserLocation();
    const latitude = userLocation.latitude;
    const longitude = userLocation.longitude;
    this.moveUserMarker(latitude, longitude);
    console.log("Localização do usuário: \nLatitude:"+latitude+"\nLongitude:"+longitude);
  }

  startUpdatingUserLocation() {
    this.updateInterval = setInterval(() => {
      this.updateUserLocation();
    }, 5000); // Atualiza a cada 5 segundos
  }
  
  async getUserLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      return { latitude, longitude };
    } catch (error) {
      console.error('Error getting location', error);
      // Retorne uma posição padrão em caso de erro
      return { latitude: 43.0741904, longitude: -89.3809802 };
    }
  }

  async loadMap() {
    const userLocation = await this.getUserLocation();
    const latitude = userLocation.latitude;
    const longitude = userLocation.longitude;

    this.map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    //adicionando o user marker
    this.userMarker = L.marker([latitude, longitude]).addTo(this.map)
      .bindPopup('Você está aqui!')
      .openPopup();

    //adicionando o workarea marker e seu círculo de área.
    this.workareaMarker = L.marker([latitude+0.001, longitude+0.001]).addTo(this.map)
    .bindPopup('Esse é seu local de trabalho.')
    .openPopup();
    this.workareaCircle = L.circle([latitude + 0.001, longitude + 0.001], {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.2,
      radius: this.workareaSize // em metros
    }).addTo(this.map);
    this.displayBaterPontoButton();
  }

  moveUserMarker(newLatitude: number, newLongitude: number) {
    if (this.userMarker) {
      this.userMarker.setLatLng([newLatitude, newLongitude]);
      this.userMarker.openPopup(); 
    }
    console.log("O Usuário está dentro da zona de trabalho dele?: "+this.isMarkerInWorkArea());
    this.displayBaterPontoButton();
  }

  displayBaterPontoButton(){
    //caso esteja fora da workarea, o botão que permite que ele bata ponto é escondido.
    if(this.isMarkerInWorkArea()){
      $("#map").css("height","80%");
      $("#botao_bater_ponto").css("display","block");
    }else{
      $("#map").css("height","100%");
      $("#botao_bater_ponto").css("display","none");
    }


  }

  isMarkerInWorkArea() {
    if (this.userMarker && this.workareaCircle) {
      const markerLatLng = this.userMarker.getLatLng();
      const workareaMakerLatLng = this.workareaCircle.getLatLng();
  
      // Calcula a distância entre o marcador e o centro do círculo da área de trabalho
      const distance = markerLatLng.distanceTo(workareaMakerLatLng);
  
      // Verifica se a distância é menor ou igual ao raio do círculo (200 metros)
      if (distance <= this.workareaCircle.getRadius()) {
        return true; // O marcador está dentro da área de trabalho
      } else {
        return false; // O marcador está fora da área de trabalho
      }
    }
    return false; // Caso algum dos marcadores ou do círculo não esteja definido
  }

  async onClickBaterPonto() {
    if(this.isMarkerInWorkArea()){
      console.log("Redirecionando...");
      await this.router.navigateByUrl('/');
    }else{
      console.log("Você está fora da zona de trabalho!");
    }
    
  }
  

}