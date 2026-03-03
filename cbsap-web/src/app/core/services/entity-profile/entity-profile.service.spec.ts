import { TestBed } from '@angular/core/testing';

import { EntityProfileService } from './entity-profile.service';

describe('EntityProfileService', () => {
  let service: EntityProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
