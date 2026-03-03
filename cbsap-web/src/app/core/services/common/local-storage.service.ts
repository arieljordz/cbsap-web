import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private localStorage: Storage;

  constructor() {
    this.localStorage = window.localStorage;
  }

  get(key: string): any {
    const item = this.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }
  set(key: string, value: any): void {
    this.localStorage.setItem(key, JSON.stringify(value));
  }
   
  remove(key:string): void {
    this.localStorage.removeItem(key);
  }
  clear(): void {
    localStorage.clear(); 
  }

}
