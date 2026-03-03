import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingFlowUsersComponent } from './routing-flow-users.component';

describe('RoutingFlowUsersComponent', () => {
  let component: RoutingFlowUsersComponent;
  let fixture: ComponentFixture<RoutingFlowUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutingFlowUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutingFlowUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
