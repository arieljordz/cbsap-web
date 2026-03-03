import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeywordEditorComponent } from './keyword-editor.component';


describe('KeywordEditorComponent', () => {
  let component: KeywordEditorComponent;
  let fixture: ComponentFixture<KeywordEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [KeywordEditorComponent]
});
    fixture = TestBed.createComponent(KeywordEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
