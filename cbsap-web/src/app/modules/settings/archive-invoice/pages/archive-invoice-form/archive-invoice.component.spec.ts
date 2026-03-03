import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveInvoiceComponent } from './archive-invoice.component';

describe('ArchiveInvoiceComponent', () => {
  let component: ArchiveInvoiceComponent;
  let fixture: ComponentFixture<ArchiveInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
