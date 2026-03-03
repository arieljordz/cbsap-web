import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionQueueSearchComponent } from './exception-queue-search.component';

describe('ExceptionQueueSearchComponent', () => {
  let component: ExceptionQueueSearchComponent;
  let fixture: ComponentFixture<ExceptionQueueSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExceptionQueueSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExceptionQueueSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
