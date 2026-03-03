import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagerPopupComponent } from './role-manaager-popup.component';

describe('RoleManaagerPopupComponent', () => {
  let component: RoleManagerPopupComponent;
  let fixture: ComponentFixture<RoleManagerPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RoleManagerPopupComponent]
});
    fixture = TestBed.createComponent(RoleManagerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
