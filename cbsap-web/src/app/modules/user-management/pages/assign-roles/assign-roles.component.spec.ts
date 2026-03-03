import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRolesComponent } from './assign-roles.component';

describe('AssignRolesComponent', () => {
  let component: AssignRolesComponent;
  let fixture: ComponentFixture<AssignRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AssignRolesComponent]
});
    fixture = TestBed.createComponent(AssignRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
