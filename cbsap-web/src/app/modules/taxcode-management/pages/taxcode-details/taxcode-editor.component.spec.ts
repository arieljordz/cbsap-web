import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCodeEditorComponent } from './taxcode-editor.component';

describe('NoticeComponent', () => {
  let component: TaxCodeEditorComponent;
  let fixture: ComponentFixture<TaxCodeEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TaxCodeEditorComponent]
});
    fixture = TestBed.createComponent(TaxCodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
