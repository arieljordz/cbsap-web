import { TestBed } from '@angular/core/testing';

import { CustomConfirmDialogService } from './custom-confirm-dialog.service';

describe('CustomConfirmDialogService', () => {
  let service: CustomConfirmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomConfirmDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
