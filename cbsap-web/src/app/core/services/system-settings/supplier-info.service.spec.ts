import { TestBed } from '@angular/core/testing';

import { SupplierInfoService } from './supplier-info.service';

describe('SupplierInfoService', () => {
  let service: SupplierInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
