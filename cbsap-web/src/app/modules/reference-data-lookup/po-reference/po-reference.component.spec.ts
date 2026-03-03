import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoReferenceComponent } from './po-reference.component';

describe('PoReferenceComponent', () => {
  let component: PoReferenceComponent;
  let fixture: ComponentFixture<PoReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
