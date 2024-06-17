import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FaceapiService } from 'src/app/services/faceapi.service';
import { NavParamsService } from 'src/app/services/nav-params.service';

@Component({
  selector: 'app-identify-faces',
  templateUrl: './identify-faces.page.html',
  styleUrls: ['./identify-faces.page.scss'],
})
export class IdentifyFacesPage implements OnInit {

  detections: any[] = [];
  faces: any[] = [];
  names: { [key: number]: string } = {};
  file: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParamsService,
    private faceApiService: FaceapiService,
  ) { }

  async ngOnInit() {

    this.detections = this.navParams.get('detections');
    this.file = this.navParams.get('file');
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    this.detections.map((detection, index) => {
        const { x, y, width, height } = detection.detection.box;
        canvas.width = width;
        canvas.height = height;
        context!.clearRect(0, 0, width, height);
        context!.drawImage(this.file, x, y, width, height, 0, 0, width, height);
        
        const faceImg = new Image();
        faceImg.src = canvas.toDataURL();
        this.faces.push({
          face_id: index,
          image: faceImg
        });
    });

  }


  async handleSave() {
    const faceMatcher = await this.faceApiService.registerFaces(this.detections, Object.values(this.names))

    this.navParams.setParams({ faceMatcher });
    this.navCtrl.navigateForward(['/face-recognition']);
  }

}
