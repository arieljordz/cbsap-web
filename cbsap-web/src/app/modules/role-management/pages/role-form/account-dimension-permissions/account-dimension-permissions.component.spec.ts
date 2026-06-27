import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDimensionPermissionsComponent } from './account-dimension-permissions.component';

describe('AccountDimensionPermissionsComponent', () => {
  let component: AccountDimensionPermissionsComponent;
  let fixture: ComponentFixture<AccountDimensionPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDimensionPermissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDimensionPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
