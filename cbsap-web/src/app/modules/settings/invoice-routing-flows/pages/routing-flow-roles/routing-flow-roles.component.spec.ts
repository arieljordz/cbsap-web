import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingFlowRolesComponent } from './routing-flow-roles.component';

describe('RoutingFlowRolesComponent', () => {
  let component: RoutingFlowRolesComponent;
  let fixture: ComponentFixture<RoutingFlowRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutingFlowRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutingFlowRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
