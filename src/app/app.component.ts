import { Component, OnInit } from '@angular/core';
import { FaceapiService } from './services/faceapi.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private faceApiService: FaceapiService) {}

  async ngOnInit() {
    await this.faceApiService.loadModels();
  }
}
