import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaceRecognitionPage } from './face-recognition.page';

describe('FaceRecognitionPage', () => {
  let component: FaceRecognitionPage;
  let fixture: ComponentFixture<FaceRecognitionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceRecognitionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
