import { TestBed } from '@angular/core/testing';

import { ResultsHttpService } from './results-http.service';

describe('ResultsHttpService', () => {
  let service: ResultsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
