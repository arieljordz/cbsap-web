import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitySearchComponent } from './entity-search.component';

describe('EntitySearchComponent', () => {
  let component: EntitySearchComponent;
  let fixture: ComponentFixture<EntitySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitySearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
