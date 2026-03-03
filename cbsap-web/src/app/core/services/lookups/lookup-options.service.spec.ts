import { TestBed } from '@angular/core/testing';

import { LookupOptionsService } from './lookup-options.service';

describe('LookupOptionsService', () => {
  let service: LookupOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookupOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
