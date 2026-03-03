import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceValidationMessageComponent } from './invoice-validation-message.component';

describe('InvoiceValidationMessageComponent', () => {
  let component: InvoiceValidationMessageComponent;
  let fixture: ComponentFixture<InvoiceValidationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceValidationMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceValidationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
