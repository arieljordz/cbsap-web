import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceActivityLogComponent } from './invoice-activity-log.component';

describe('InvoiceActivityLogComponent', () => {
  let component: InvoiceActivityLogComponent;
  let fixture: ComponentFixture<InvoiceActivityLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceActivityLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
