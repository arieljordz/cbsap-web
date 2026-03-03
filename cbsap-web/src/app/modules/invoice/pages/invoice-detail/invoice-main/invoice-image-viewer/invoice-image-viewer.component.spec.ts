import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceImageViewerComponent } from './invoice-image-viewer.component';

describe('InvoiceImageViewerComponent', () => {
  let component: InvoiceImageViewerComponent;
  let fixture: ComponentFixture<InvoiceImageViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceImageViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
