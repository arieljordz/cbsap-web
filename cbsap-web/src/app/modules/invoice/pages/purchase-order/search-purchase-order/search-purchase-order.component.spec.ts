import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPurchaseOrderComponent } from './search-purchase-order.component';

describe('SearchPurchaseOrderComponent', () => {
  let component: SearchPurchaseOrderComponent;
  let fixture: ComponentFixture<SearchPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPurchaseOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
