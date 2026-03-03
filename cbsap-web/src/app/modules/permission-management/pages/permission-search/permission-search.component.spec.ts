import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionSearchComponent } from './permission-search.component';

describe('PermissionSearchComponent', () => {
  let component: PermissionSearchComponent;
  let fixture: ComponentFixture<PermissionSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [PermissionSearchComponent]
});
    fixture = TestBed.createComponent(PermissionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
