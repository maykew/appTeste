import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import * as faceapi from 'face-api.js';
import { Geolocation } from '@capacitor/geolocation';

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
    latitude?: number;
    longitude?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

    constructor() { }

    public register: boolean = true;
    public faceMatcher: any;
    public detections: any;
    public match: any;

    public photo: UserPhoto = {
        filepath: "",
        webviewPath: ""
    };
    public photo2: UserPhoto = {
        filepath: "",
        webviewPath: ""
    };

    public async uploadFile() {
        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos,
            quality: 100
        });

        const img = new Image();
        img.src = capturedPhoto.webPath!;

        return img;
    }
    
    public async addNewToGallery() {
        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos,
            quality: 100
        });

        const position = await Geolocation.getCurrentPosition();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const img = document.createElement('img');
        img.src = capturedPhoto.webPath!;
        document.body.append(img);

        if (this.register) {
            this.photo = {
                filepath: "soon...",
                webviewPath: capturedPhoto.webPath!,
                latitude: latitude,
                longitude: longitude
            };

            // await this.loadModels();
            
            this.detections = await faceapi
                .detectAllFaces(img)
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (this.detections.length) {

                const inputImage = document.getElementById('inputImage') as HTMLImageElement;
                const canvas = document.getElementById('canvas') as HTMLCanvasElement;

                inputImage.src = capturedPhoto.webPath!;
                canvas.width = inputImage.width;
                canvas.height = inputImage.height;
                faceapi.matchDimensions(canvas, inputImage);
                const resizedDetections = faceapi.resizeResults(this.detections, {
                    width: inputImage.width,
                    height: inputImage.height
                });

                resizedDetections.map((face: any, index: number) => {
                    const textField = new faceapi.draw.DrawTextField([`Pessoa ${index}`], face.detection.box.bottomLeft)
                    textField.draw(canvas)
                });
        
                faceapi.draw.drawDetections(canvas, resizedDetections);
                // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

                const labeledDescriptors = this.detections.map((detection: any, index: number) => {
                    return new faceapi.LabeledFaceDescriptors(
                      `Pessoa ${index}`,
                      [detection.descriptor]
                    );
                });

                this.faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)

                this.register = false;
            }
        } else {

            const inputImage2 = document.getElementById('inputImage2') as HTMLImageElement;
            const canvas2 = document.getElementById('canvas2') as HTMLCanvasElement;
            
            this.photo2 = {
                filepath: "soon...",
                webviewPath: capturedPhoto.webPath!,
                latitude: latitude,
                longitude: longitude
            };
    
            const singleResult = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor()
    
            if (singleResult) {

                inputImage2.src = capturedPhoto.webPath!;
                canvas2.width = inputImage2.width;
                canvas2.height = inputImage2.height;
                faceapi.matchDimensions(canvas2, inputImage2);
                const resizedDetections = faceapi.resizeResults(singleResult, {
                    width: inputImage2.width,
                    height: inputImage2.height
                });
                
                this.match = this.faceMatcher.findBestMatch(singleResult.descriptor)

                const textField = new faceapi.draw.DrawTextField([this.match.label], resizedDetections.detection.box.bottomLeft)
                textField.draw(canvas2)
        
                faceapi.draw.drawDetections(canvas2, resizedDetections);
                // faceapi.draw.drawFaceLandmarks(canvas2, resizedDetections);
            }
        }

            

    }
}