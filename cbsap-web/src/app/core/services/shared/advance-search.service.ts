import { trigger } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdvanceSearchEventService {
  private reloadSubject = new Subject<string>();
  reloadSubject$ = this.reloadSubject.asObservable();

 

  constructor() {}

  emitReloadSubject(formName: string) {
    this.reloadSubject.next(formName);
  }
}
