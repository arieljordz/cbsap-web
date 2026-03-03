import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedInvoiceComponent } from './assigned-invoice.component';

describe('NoticeComponent', () => {
  let component: AssignedInvoiceComponent;
  let fixture: ComponentFixture<AssignedInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [AssignedInvoiceComponent]
});
    fixture = TestBed.createComponent(AssignedInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
