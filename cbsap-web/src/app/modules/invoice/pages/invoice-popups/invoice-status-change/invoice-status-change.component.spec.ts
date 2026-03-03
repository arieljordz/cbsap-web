import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceStatusChangeComponent } from './invoice-status-change.component';

describe('InvoiceStatusChangeComponent', () => {
  let component: InvoiceStatusChangeComponent;
  let fixture: ComponentFixture<InvoiceStatusChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceStatusChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceStatusChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
