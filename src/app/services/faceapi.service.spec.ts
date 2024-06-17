import { TestBed } from '@angular/core/testing';

import { FaceapiService } from './faceapi.service';

describe('FaceapiService', () => {
  let service: FaceapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
