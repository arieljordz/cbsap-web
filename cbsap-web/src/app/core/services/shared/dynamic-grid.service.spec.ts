import { TestBed } from '@angular/core/testing';

import { DynamicGridService } from './dynamic-grid.service';

describe('DynamicGridService', () => {
  let service: DynamicGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
