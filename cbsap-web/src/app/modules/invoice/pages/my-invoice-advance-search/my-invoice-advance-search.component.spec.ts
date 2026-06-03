import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyInvoiceAdvanceSearchComponent } from './my-invoice-advance-search.component';


describe('MyInvoiceAdvanceSearchComponent', () => {
  let component: MyInvoiceAdvanceSearchComponent;
  let fixture: ComponentFixture<MyInvoiceAdvanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyInvoiceAdvanceSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyInvoiceAdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
