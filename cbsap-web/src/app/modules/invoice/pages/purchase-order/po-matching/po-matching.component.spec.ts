import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoMatchingComponent } from './po-matching.component';

describe('PoMatchingComponent', () => {
  let component: PoMatchingComponent;
  let fixture: ComponentFixture<PoMatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoMatchingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
