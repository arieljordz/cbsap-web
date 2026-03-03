import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceSupplierSearchComponent } from './invoice-supplier-search.component';

describe('InvoiceSupplierSearchComponent', () => {
  let component: InvoiceSupplierSearchComponent;
  let fixture: ComponentFixture<InvoiceSupplierSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceSupplierSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceSupplierSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
