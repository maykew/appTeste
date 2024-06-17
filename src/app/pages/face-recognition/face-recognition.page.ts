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
    const match = await this.faceApiService.findBestMatch(file, this.faceMatcher)
    let message: string;
    if (match.label === 'unknown') {
      message = 'Pessoa da foto não foi identificada'
      } else {
      message = `Pessoa identificada na foto: ${match.toString()}`
    }
    const alert = await this.alertCtrl.create({
      header: 'Resultado',
      message: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          
        }
      ]
    });
    alert.present();

  }

  reset() {
    this.navCtrl.navigateForward(['/']);
  }

}
