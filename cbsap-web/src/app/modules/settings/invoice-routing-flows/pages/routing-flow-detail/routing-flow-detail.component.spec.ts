import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingFlowDetailComponent } from './routing-flow-detail.component';

describe('RoutingFlowDetailComponent', () => {
  let component: RoutingFlowDetailComponent;
  let fixture: ComponentFixture<RoutingFlowDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutingFlowDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutingFlowDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
