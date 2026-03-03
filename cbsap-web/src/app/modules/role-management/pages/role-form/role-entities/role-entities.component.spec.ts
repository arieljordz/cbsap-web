import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleEnetitiesComponent } from './role-entities.component';

describe('RoleEnetitiesComponent', () => {
  let component: RoleEnetitiesComponent;
  let fixture: ComponentFixture<RoleEnetitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleEnetitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleEnetitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
