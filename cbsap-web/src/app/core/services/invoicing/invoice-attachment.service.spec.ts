import { TestBed } from '@angular/core/testing';

import { InvoiceAttachmentService } from './invoice-attachment.service';

describe('InvoiceAttachmentService', () => {
  let service: InvoiceAttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceAttachmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
