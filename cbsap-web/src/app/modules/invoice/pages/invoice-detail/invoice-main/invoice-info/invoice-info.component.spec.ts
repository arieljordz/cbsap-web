import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceInfoComponent } from './invoice-info.component';

describe('InvoiceInfoComponent', () => {
  let component: InvoiceInfoComponent;
  let fixture: ComponentFixture<InvoiceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
