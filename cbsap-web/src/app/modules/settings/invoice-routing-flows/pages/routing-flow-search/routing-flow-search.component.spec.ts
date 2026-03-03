import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingFlowSearchComponent } from './routing-flow-search.component';

describe('RoutingFlowSearchComponent', () => {
  let component: RoutingFlowSearchComponent;
  let fixture: ComponentFixture<RoutingFlowSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutingFlowSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutingFlowSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
