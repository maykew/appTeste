import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { LatLngExpression } from 'leaflet';
import { AlertController, Platform } from '@ionic/angular';

import { LoadingController, NavController } from '@ionic/angular';
import { NavParamsService } from 'src/app/services/nav-params.service';

@Component({
  selector: 'app-register-workarea',
  templateUrl: './register-workarea.page.html',
  styleUrls: ['./register-workarea.page.scss'],
})
export class RegisterWorkareaPage implements OnInit, OnDestroy {
  map: L.Map | undefined;
  userMarker: L.Marker | undefined;
  iconDefault: L.Icon<L.IconOptions> | undefined;
  updateInterval: any;
  workareapolygon: L.Polygon | undefined;
  workareaname: String | undefined; // valor do input de nome da zona de trabalho

  workareapolygonPoints: LatLngExpression[] = [
  ];

  



  constructor(
    private router: Router, 
    private alertController: AlertController,
    private navParams: NavParamsService,
    public navCtrl: NavController,
    private platform:Platform) 
    
    {
      if(this.platform.is('android')){
        const permissionStatus = Geolocation.requestPermissions();
      }
    }


  ngOnInit() {
    this.configureMarkerIconOptions();
    this.loadMap();
    this.startUpdatingUserLocation();
    this.presentAlertInstrucoes();
  }

  ngOnDestroy() {
    this.map=this.map?.remove();

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  



  
  configureMarkerIconOptions(){
    this.iconDefault = L.icon({
      iconRetinaUrl: 'assets/marker_images/marker-icon-2x.png',
      iconUrl: 'assets/marker_images/marker-icon.png',
      shadowUrl: 'assets/marker_images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = this.iconDefault;
  }


  async loadMap() {
    const userLocation = await this.getUserLocation();
    const latitude = userLocation.latitude;
    const longitude = userLocation.longitude;

    this.map = L.map('map').setView([latitude, longitude], 17);
    // Adicione o evento de clique no mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onClickMap(e);
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Adicionando o user marker
    this.userMarker = L.marker([latitude, longitude])
      .addTo(this.map)
      .bindPopup('Você está aqui!')
      .openPopup();

    // Crie o polígono com os pontos definidos
    this.workareapolygon = L.polygon(this.workareapolygonPoints, {
      color: 'blue', // Cor da linha do polígono
      fillColor: 'blue', // Cor de preenchimento do polígono
      fillOpacity: 0.2, // Opacidade de preenchimento do polígono (0 a 1)
    }).addTo(this.map);
  }





  async updateUserLocation() {
    const userLocation = await this.getUserLocation();
    const latitude = userLocation.latitude;
    const longitude = userLocation.longitude;
    this.moveUserMarker(latitude, longitude);
    console.log(
      'Localização do usuário: \nLatitude:' +
        latitude +
        '\nLongitude:' +
        longitude
    );
  }

  startUpdatingUserLocation() {
    this.updateInterval = setInterval(() => {
      this.updateUserLocation();
    }, 5000); // Atualiza a cada 5 segundos
  }

  //modificação no GetCurrentPosition para suportar Alta Precisão.
  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            reject(error);
          },
          { enableHighAccuracy: true } // Solicita a localização exata
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }

  async getUserLocation() {
    try {
      const position = await this.getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      return { latitude, longitude };
    } catch (error) {
      console.error('Error getting location', error);
      // Retorne uma posição padrão em caso de erro
      return { latitude: 0, longitude: 0 };
    }
  }

  updateVisualizacaoWorkarea() {
    if (this.workareapolygon) {
      this.map?.removeLayer(this.workareapolygon);
    }

    if(this.map){
      this.workareapolygon = L.polygon(this.workareapolygonPoints, {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.2,
      }).addTo(this.map);
    }
  }

  moveUserMarker(newLatitude: number, newLongitude: number) {
    if (this.userMarker) {
      this.userMarker.setLatLng([newLatitude, newLongitude]);
      this.userMarker.openPopup();
    }
    
    console.log("O Usuário está dentro da zona de trabalho dele?: " + this.isMarkerInWorkArea(newLatitude, newLongitude));
    this.displayBaterPontoButton(newLatitude,newLongitude);
  }

  displayBaterPontoButton(newLatitude:number,newLongitude:number) {
    // só mostra se o usuário selecionar pelomenos 3 pontos.
    if(this.workareapolygonPoints.length >= 3 ){
      
      if (this.isMarkerInWorkArea(newLatitude, newLongitude)) {
        $('#map').css('height', '80%');
        $("#input_nome_workarea").css('display', 'none');
        $('#botao_bater_ponto').css("display","block");
        $("#botao_cadastrar_workzone").css("display","none");
      } else {
        $('#map').css('height', '70%');
        $("#input_nome_workarea").css('display', 'block');
        $('#botao_bater_ponto').css("display","none");
        $("#botao_cadastrar_workzone").css("display","block");
      }

    }
  }

  async presentAlertInstrucoes() {
    const alert = await this.alertController.create({
      header: 'Instrução',
      //message: 'Clique na tela para definir os limites da Zona de trabalho e Insira o nome da localidade.',
      message: 'Selecione uma área de trabalho. Se você estiver fora dela, ela será cadastrada como nova zona; se estiver dentro, você poderá bater o ponto.',
      buttons: ['OK'],
    });

    await alert.present();
  }



  isMarkerInWorkArea(latitude?: number, longitude?: number): boolean {
    if (!latitude || !longitude) {
      return false;
    }

    const userLocation = { latitude, longitude };
    return this.isPointInPolygon(userLocation, this.workareapolygonPoints);
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


  



  async onClickBaterPonto() {
    /*
    if(this.workareaname!="" && this.workareaname!=undefined && this.workareapolygonPoints.length>=3){
      const workareaname = this.workareaname;
      const workareapolygonPoints = this.workareapolygonPoints;
      console.log('Área cadastrada');
      console.log('Enviando dados:', workareaname, workareapolygonPoints);
      this.navParams.setParams({ workareaname, workareapolygonPoints });
      this.ngOnDestroy();
      this.navCtrl.navigateForward('/localization-map');
      
    }else{
      this.presentAlertInstrucoes();
    }
    */

    const alert = await this.alertController.create({
      header: 'Parabéns',
      message: 'Você acaba de bater o ponto!',
      buttons: ['OK'],
    });
    await alert.present();
    this.navCtrl.navigateForward('/register-face');
  }

  async onClickCadastrarWorkzone(){

    if(this.workareaname){
      const alert = await this.alertController.create({
        header: 'Parabéns',
        message: 'Você acaba de cadastrar uma Zona de trabalho!',
        buttons: ['OK'],
      });
      await alert.present();
    }else{
      const alert = await this.alertController.create({
        header: 'Erro!',
        message: 'Insira o nome da Zona de trabalho!',
        buttons: ['OK'],
      });
      await alert.present();
    }

  }

  async onClickMap(e: L.LeafletMouseEvent) {
    console.log(`Mapa clicado em: \nLatitude: ${e.latlng.lat}, \nLongitude: ${e.latlng.lng}`);
    this.workareapolygonPoints.push(L.latLng(e.latlng.lat, e.latlng.lng));
    this.updateVisualizacaoWorkarea();
    this.updateUserLocation();
  }



}
