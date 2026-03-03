import { TestBed } from '@angular/core/testing';

import { LookUpsService } from './look-ups.service';

describe('LookUpsService', () => {
  let service: LookUpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookUpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
