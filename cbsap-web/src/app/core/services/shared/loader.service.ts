import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService implements OnDestroy {
  private requestCount = 0;
  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable().pipe(distinctUntilChanged()); 
  constructor() { }

  show() {
    this.requestCount++;
    if (!this._isLoading.value) {
      this._isLoading.next(true);
    }
  }

  hide() {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if (this.requestCount === 0 && this._isLoading.value) {
      this._isLoading.next(false);
    }
  }

  ngOnDestroy() {
    this._isLoading.complete(); 
  }
}
