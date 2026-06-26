import { TestBed } from '@angular/core/testing';

import { AccountDimensionService } from './account-dimension.service';

describe('AccountDimensionService', () => {
  let service: AccountDimensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountDimensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
