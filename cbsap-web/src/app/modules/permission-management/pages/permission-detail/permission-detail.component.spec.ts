import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionDetailComponent } from './permission-detail.component';

describe('PermissionDetailComponent', () => {
  let component: PermissionDetailComponent;
  let fixture: ComponentFixture<PermissionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [PermissionDetailComponent]
});
    fixture = TestBed.createComponent(PermissionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
