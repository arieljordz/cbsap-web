import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxCodeSearchComponent } from './taxcode-search.component';


describe('TaxCodeSearchComponent', () => {
  let component: TaxCodeSearchComponent;
  let fixture: ComponentFixture<TaxCodeSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TaxCodeSearchComponent]
});
    fixture = TestBed.createComponent(TaxCodeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
