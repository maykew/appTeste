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
  userLocation= {latitude:0,longitude:0};

  



  constructor(
    private router: Router, 
    private alertController: AlertController,
    private navParams: NavParamsService,
    public navCtrl: NavController,
    public notificationService: NotificationService,
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
    this.displayBaterPontoButton();
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
    this.userLocation = await this.getUserLocation();
    const latitude = this.userLocation.latitude;
    const longitude = this.userLocation.longitude;

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
    this.userLocation = await this.getUserLocation();
    this.moveUserMarker(this.userLocation.latitude, this.userLocation.longitude);
    console.log(
      'Localização do usuário: \nLatitude:' +
        this.userLocation.latitude +
        '\nLongitude:' +
        this.userLocation.longitude
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
          { enableHighAccuracy: true ,} // Solicita a localização exata
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

  displayBaterPontoButton(newLatitude?:number,newLongitude?:number) {
      
      /*
      if (this.isMarkerInWorkArea(newLatitude, newLongitude)) {
        //mostra o botao de bater ponto
        $('#map').css('height', '80%');
        $("#input_nome_workarea").css('display', 'none');
        $('#botao_bater_ponto').css("display","block");
        $("#botao_cadastrar_workzone").css("display","none");
      } else {
        //mostra o input de nome e o botao de cadastrar localidade
        if(this.workareapolygonPoints.length >= 3 ){
        $('#map').css('height', '70%');
        $("#input_nome_workarea").css('display', 'block');
        $('#botao_bater_ponto').css("display","none");
        $("#botao_cadastrar_workzone").css("display","block");
        }
      }
      */
      $("#input_nome_workarea").css('display', 'none');

      if (this.workareapolygonPoints.length<3){
        $('#botao_bater_ponto').css("display","none");
        $("#botao_cadastrar_workzone").css("display","none");
        $('#map').css('height', '100%');
      }else{
        $('#botao_bater_ponto').css("display","block");
        $('#map').css('height', '80%');
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


  



  async requestPermissions() {
    const permission = await LocalNotifications.requestPermissions();
    return permission;
}

async onClickBaterPonto() {
    //para permitir que o usuário prossiga com o registro de ponto:
    /*
    const alert = await this.alertController.create({
        header: 'Parabéns',
        message: 'Você acaba de bater o ponto!',
        buttons: ['OK'],
    });
    await alert.present();
    this.navCtrl.navigateForward('/register-face');
    */

    //notificações para navegador
    /*
    if (Notification.permission === 'granted') {
        // Cria e exibe a notificação
        new Notification('Dentro da área!', {
            body: 'Você acaba de bater o ponto!',
        });
    } else if (Notification.permission !== 'denied') {
        console.log("Sem Permissão");
        // Se não tiver permissão, solicita
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            new Notification('Parabéns!', {
                body: 'Você acaba de bater o ponto!',
            });
        }
    }
    */
    
    const permission = await this.requestPermissions();
    console.log(permission.display);
    
    if (permission.display === 'granted') {
        // Coletando dados para criação da Notificação
        const latitude = this.userLocation.latitude;
        const longitude = this.userLocation.longitude;
        const isInside = this.isPointInPolygon({ latitude, longitude }, this.workareapolygonPoints);

        this.sendNotification(isInside,latitude,longitude);
    } else {
        console.log('Permissão para notificações negada.');
        // Aqui você pode exibir um alerta ou mensagem informando o usuário
        const alert = await this.alertController.create({
            header: 'Permissão Negada',
            message: 'Você precisa permitir notificações para usar esta funcionalidade.',
            buttons: ['OK'],
        });
        await alert.present();
    }
}





async sendNotification(isInside: boolean, latitude: number, longitude: number) {
  const locationMessage = `Localização: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  const statusMessage = isInside ? 'Você está dentro da área!' : 'Você está fora da área!';

  // Formata a mensagem da notificação
  const notificationMessage = `${statusMessage} ${locationMessage}\n`; // Adiciona uma quebra de linha no final

  // Adiciona a notificação ao histórico no serviço
  this.notificationService.addNotification(notificationMessage);

  await LocalNotifications.schedule({
      notifications: [
          {
              title: "Registro de Ponto",
              body: notificationMessage,
              id: 1,
              schedule: { at: new Date(Date.now() + 1000 * 5) }, // programada para 5 segundos no futuro
              actionTypeId: "",
              extra: null,
          },
      ],
  });
}










  async onClickCadastrarWorkzone(){

    if(this.workareaname){
      const alert = await this.alertController.create({
        header: 'Parabéns',
        message: 'Você acaba de cadastrar uma Zona de trabalho! ',
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
