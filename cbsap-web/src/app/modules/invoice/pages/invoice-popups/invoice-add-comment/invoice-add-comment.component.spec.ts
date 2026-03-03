import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAddCommentComponent } from './invoice-add-comment.component';

describe('InvoiceAddCommentComponent', () => {
  let component: InvoiceAddCommentComponent;
  let fixture: ComponentFixture<InvoiceAddCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceAddCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceAddCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
