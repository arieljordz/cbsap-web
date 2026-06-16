import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReferenceDetailComponent } from './po-reference-detail.component';

describe('PoReferenceDetailComponent', () => {
  let component: PoReferenceDetailComponent;
  let fixture: ComponentFixture<PoReferenceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoReferenceDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoReferenceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
