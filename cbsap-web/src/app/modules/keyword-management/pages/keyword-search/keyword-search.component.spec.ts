import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeywordSearchComponent } from './keyword-search.component';


describe('KeywordSearchComponent', () => {
  let component: KeywordSearchComponent;
  let fixture: ComponentFixture<KeywordSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [KeywordSearchComponent]
});
    fixture = TestBed.createComponent(KeywordSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
