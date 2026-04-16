import { TestBed } from '@angular/core/testing';

import { InvoiceInquiryService } from './invoice-inquiry.service';

describe('InvoiceInquiryService', () => {
  let service: InvoiceInquiryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceInquiryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
