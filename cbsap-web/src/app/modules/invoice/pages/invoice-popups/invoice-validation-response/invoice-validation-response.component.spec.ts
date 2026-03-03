import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceValidationResponseComponent } from './invoice-validation-response.component';

describe('InvoiceValidationResponseComponent', () => {
  let component: InvoiceValidationResponseComponent;
  let fixture: ComponentFixture<InvoiceValidationResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceValidationResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceValidationResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
