import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { FaceapiService } from 'src/app/services/faceapi.service';
import { NavParamsService } from 'src/app/services/nav-params.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-face-recognition',
  templateUrl: './face-recognition.page.html',
  styleUrls: ['./face-recognition.page.scss'],
})
export class FaceRecognitionPage implements OnInit {

  faceMatcher: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParamsService,
    public photoService: PhotoService,
    private faceApiService: FaceapiService,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.faceMatcher = this.navParams.get('faceMatcher');
  }

  async handleUpload() {
    const file = await this.photoService.uploadFile();
    
    const imageOriginal = document.getElementById('inputImageOriginal') as HTMLImageElement;
    const image = document.getElementById('inputImage') as HTMLImageElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    
    image.src = file.src;
    imageOriginal.src = file.src;
    
    canvas.width = imageOriginal.width;
    canvas.height = imageOriginal.height;
    
    const detections = this.faceApiService.detectFaces(file);

    await this.faceApiService.findMatchesAndShowResult(this.faceMatcher, canvas, image, imageOriginal, detections);
  }

  reset() {
    this.navCtrl.navigateForward(['/']);
  }

}
