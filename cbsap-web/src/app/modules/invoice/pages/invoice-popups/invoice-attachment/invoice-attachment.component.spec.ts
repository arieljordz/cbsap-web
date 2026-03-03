import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAttachmentComponent } from './invoice-attachment.component';

describe('InvoiceAttachmentComponent', () => {
  let component: InvoiceAttachmentComponent;
  let fixture: ComponentFixture<InvoiceAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceAttachmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
