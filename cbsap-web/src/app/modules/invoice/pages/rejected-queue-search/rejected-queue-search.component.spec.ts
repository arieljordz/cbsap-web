import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedQueueSearchComponent } from './rejected-queue-search.component';

describe('RejectedQueueSearchComponent', () => {
  let component: RejectedQueueSearchComponent;
  let fixture: ComponentFixture<RejectedQueueSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedQueueSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedQueueSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
