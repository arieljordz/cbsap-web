import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRoutingFlowComponent } from './invoice-routing-flow.component';

describe('InvoiceRoutingFlowComponent', () => {
  let component: InvoiceRoutingFlowComponent;
  let fixture: ComponentFixture<InvoiceRoutingFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceRoutingFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceRoutingFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
