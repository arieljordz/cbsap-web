import { TestBed } from '@angular/core/testing';

import { GlobalErrorInterceptorInterceptor } from './global-error-interceptor.interceptor';

describe('GlobalErrorInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GlobalErrorInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: GlobalErrorInterceptorInterceptor = TestBed.inject(GlobalErrorInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
