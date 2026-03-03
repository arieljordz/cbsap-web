import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserVerificationComponent } from './new-user-verification.component';

describe('NewUserVerificationComponent', () => {
  let component: NewUserVerificationComponent;
  let fixture: ComponentFixture<NewUserVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUserVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewUserVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
