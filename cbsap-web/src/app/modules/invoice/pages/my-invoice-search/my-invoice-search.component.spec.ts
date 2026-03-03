import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInvoiceSearchComponent } from './my-invoice-search.component';

describe('MyInvoiceSearchComponent', () => {
  let component: MyInvoiceSearchComponent;
  let fixture: ComponentFixture<MyInvoiceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyInvoiceSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyInvoiceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
