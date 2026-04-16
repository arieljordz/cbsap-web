import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceInquirySearchComponent } from './invoice-inquiry-search.component';

describe('InvoiceInquirySearchComponent', () => {
  let component: InvoiceInquirySearchComponent;
  let fixture: ComponentFixture<InvoiceInquirySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceInquirySearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceInquirySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
