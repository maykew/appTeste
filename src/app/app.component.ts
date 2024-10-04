import { Component, OnInit } from '@angular/core';
import { FaceapiService } from './services/faceapi.service';
import { initializeApp } from "firebase/app";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private faceApiService: FaceapiService) {}

  async ngOnInit() {
    // Configuração do Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyCl-oxOb7mh9hpCFhm7pqfVLdKfyvCydDk",
      authDomain: "vepema-demo.firebaseapp.com",
      projectId: "vepema-demo",
      storageBucket: "vepema-demo.appspot.com",
      messagingSenderId: "174946596566",
      appId: "1:174946596566:web:9b47af8d88de2782d1bb77",
      measurementId: "G-RJQ6534TQG"
    };
    
    const app = initializeApp(firebaseConfig);
    
    // Carregar modelos de Face API
    await this.faceApiService.loadModels();

  }


}