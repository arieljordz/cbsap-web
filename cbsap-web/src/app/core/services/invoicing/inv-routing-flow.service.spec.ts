import { TestBed } from '@angular/core/testing';

import { InvRoutingFlowService } from './inv-routing-flow.service';

describe('InvRoutingFlowService', () => {
  let service: InvRoutingFlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvRoutingFlowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
