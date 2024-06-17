import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../services/photo.service';
import { FaceapiService } from 'src/app/services/faceapi.service';
import { NavController } from '@ionic/angular';
import { NavParamsService } from 'src/app/services/nav-params.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    public navCtrl: NavController,
    private navParams: NavParamsService,
    public photoService: PhotoService,
    private faceApiService: FaceapiService
  ) { }

  ngOnInit() {}

  async handleUpload() {
    const file = await this.photoService.uploadFile();
    const detections = await this.faceApiService.detectFaces(file);

    this.navParams.setParams({ detections, file });
    this.navCtrl.navigateForward('/identify-faces');
  }

}
