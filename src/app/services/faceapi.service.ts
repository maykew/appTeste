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

  private drawLabelAndBox(label: any, color: any, detection: any, fontSize: any, lineWidth: any, canvas: any) {
    const textField = new faceapi.draw.DrawTextField(
      [label], 
      detection.detection.box.bottomLeft,
      {
        fontSize: fontSize,
        fontColor: color,
        backgroundColor: 'transparent'
      }
    );
    textField.draw(canvas);
  
    const box = new faceapi.draw.DrawBox(
      detection.detection.box, 
      {
        boxColor: color,
        lineWidth: lineWidth,
      }
    );
    box.draw(canvas);
  }

  public async findMatchesAndShowResult(faceMatcher: any, canvas: any, image: any, imageOriginal: any, detections: any) {
    faceapi.matchDimensions(canvas, imageOriginal);
    
    const resizedDetections = await faceapi.resizeResults(detections, {
      width: image.width,
      height: image.height
    });

    const UNKNOWN = 'unknown';
    const UNKNOWN_LABEL = '?';
    const BOX_SIZE = 40000;
    const FONT_SIZE = 48;
    const LINE_WIDTH = 8;
    const FACE_COLOR_RECOGNIZED = 'yellow';
    const UNKNOWN_FACE_COLOR = 'red';
    
    resizedDetections.map((detection: any) => {
      const match = faceMatcher.findBestMatch(detection.descriptor);

      const boxWidth = detection.detection.box.width;
      const boxHeight = detection.detection.box.height;

      const scale = Math.sqrt((boxWidth * boxHeight) / (BOX_SIZE));

      const fontSize = FONT_SIZE * scale;
      const lineWidth = LINE_WIDTH * scale;

      const isUnknown = (match.label === UNKNOWN);
      const label = isUnknown ? UNKNOWN_LABEL : match.label;
      const color = isUnknown ? UNKNOWN_FACE_COLOR : FACE_COLOR_RECOGNIZED;

      this.drawLabelAndBox(label, color, detection, fontSize, lineWidth, canvas);

    });
  }
}
