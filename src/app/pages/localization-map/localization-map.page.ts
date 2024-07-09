
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { LatLngExpression, LatLngTuple, LatLng } from 'leaflet';

@Component({
  selector: 'app-localization-map',
  templateUrl: './localization-map.page.html',
  styleUrls: ['./localization-map.page.scss'],
})
export class LocalizationMapPage implements OnInit {
  map: L.Map | undefined;
  userMarker: L.Marker | undefined;
  updateInterval: any;
  workareapolygon: L.Polygon | undefined;

  workareapolygonPoints: LatLngExpression[] = [
    L.latLng(-20.1951324, -40.217244),
    L.latLng(-20.2001324, -40.215244),
    L.latLng(-20.2011324, -40.219244),
    // informação vinda do banco de dados
  ];

  constructor(private router: Router,) {}

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

    this.map = L.map('map').setView([latitude, longitude], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    //adicionando o user marker
    this.userMarker = L.marker([latitude, longitude]).addTo(this.map)
      .bindPopup('Você está aqui!')
      .openPopup();


    
    // Crie o polígono com os pontos definidos
    this.workareapolygon = L.polygon(this.workareapolygonPoints, {
      color: 'blue',        // Cor da linha do polígono
      fillColor: 'blue',    // Cor de preenchimento do polígono
      fillOpacity: 0.2      // Opacidade de preenchimento do polígono (0 a 1)
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
    //consulta a API passando a matriz de pontos do polígono e as coordenadas do usuário
    //argumentos:   this.workareapolygonPoints, this.getUserLocation
    return true;
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