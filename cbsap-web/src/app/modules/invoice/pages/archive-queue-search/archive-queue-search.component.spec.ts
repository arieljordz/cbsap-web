import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveQueueSearchComponent } from './archive-queue-search.component';

describe('ArchiveQueueSearchComponent', () => {
  let component: ArchiveQueueSearchComponent;
  let fixture: ComponentFixture<ArchiveQueueSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveQueueSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveQueueSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
