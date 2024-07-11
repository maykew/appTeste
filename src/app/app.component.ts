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
    const firebaseConfig = {
      apiKey: "AIzaSyDLUP7YYdCHW7Nm14y3I1_TStnPMUXEAik",
      authDomain: "vepema-demo-leds-897bc.firebaseapp.com",
      projectId: "vepema-demo-leds",
      storageBucket: "vepema-demo-leds.appspot.com",
      messagingSenderId: "946008911110",
      appId: "1:946008911110:web:50df7ae70920452f97c287"
    };
    const app = initializeApp(firebaseConfig);
    
    await this.faceApiService.loadModels();
  }
}
