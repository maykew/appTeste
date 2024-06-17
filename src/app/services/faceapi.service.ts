import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root'
})
export class FaceapiService {

  constructor() { }

  async loadModels() {
    const MODEL_URL = '/assets/models';
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    console.log('Modelos carregados com sucesso!');
  }
  
  public async detectFaces(image: any) {
    const detections = await faceapi.detectAllFaces(image)
                                    .withFaceLandmarks()
                                    .withFaceDescriptors();
    return detections
  }

  public async registerFaces(detections: any[], labels: string[]) {
    const labeledDescriptors = detections.map((detection: any, index: number) => {
      return new faceapi.LabeledFaceDescriptors(
        labels[index],
        [detection.descriptor]
      );
    });

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)

    return faceMatcher
  }

  public async findBestMatch(image: any, faceMatcher: any) {
    const result = await faceapi.detectSingleFace(image)
                                      .withFaceLandmarks()
                                      .withFaceDescriptor()
    const results = await faceapi.detectAllFaces(image)
                                      .withFaceLandmarks()
                                      .withFaceDescriptors()
    results.forEach(fd => {
      const bestMatch = faceMatcher.findBestMatch(fd.descriptor)
      console.log(bestMatch.toString())
    })
    const match = await faceMatcher.findBestMatch(result!.descriptor)
    return match
  }
}
