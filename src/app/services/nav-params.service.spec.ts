import { TestBed } from '@angular/core/testing';

import { NavParamsService } from './nav-params.service';

describe('NavParamsService', () => {
  let service: NavParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
