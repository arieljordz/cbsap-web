import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTableComponent } from './select-table.component';

describe('SelectTableComponent', () => {
  let component: SelectTableComponent;
  let fixture: ComponentFixture<SelectTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
