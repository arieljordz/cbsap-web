import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingflowRoleSelectorComponent } from './routingflow-role-selector.component';

describe('RoutingflowRoleSelectorComponent', () => {
  let component: RoutingflowRoleSelectorComponent;
  let fixture: ComponentFixture<RoutingflowRoleSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutingflowRoleSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutingflowRoleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
