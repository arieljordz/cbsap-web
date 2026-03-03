import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceActionsComponent } from './invoice-actions.component';

describe('InvoiceActionsComponent', () => {
  let component: InvoiceActionsComponent;
  let fixture: ComponentFixture<InvoiceActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
