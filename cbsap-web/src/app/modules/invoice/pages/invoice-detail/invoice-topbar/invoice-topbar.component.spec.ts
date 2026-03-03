import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTopbarComponent } from './invoice-topbar.component';

describe('InvoiceTopbarComponent', () => {
  let component: InvoiceTopbarComponent;
  let fixture: ComponentFixture<InvoiceTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceTopbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
