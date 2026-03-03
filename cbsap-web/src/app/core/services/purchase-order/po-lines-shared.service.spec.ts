import { TestBed } from '@angular/core/testing';

import { PoLinesSharedService } from './po-lines-shared.service';

describe('PoLinesSharedService', () => {
  let service: PoLinesSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoLinesSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
