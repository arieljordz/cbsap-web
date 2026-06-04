import { Injectable } from '@angular/core';
import { GridConfig } from '@core/model/dynamic-grid/grid.config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DynamicGridService<T> {
  private configSubject = new BehaviorSubject<GridConfig<T>>({
    columns: [],
    data: [],
    totalRecords: 0,
    loading: false,
  });
  gridConfig$ = this.configSubject.asObservable();

  constructor() {}

  setConfig(config: GridConfig<T>): void {
    this.configSubject.next(config);
  }

  updateData(data: T[], totalRecords: number, pageSize?: number): void {
    const current = this.configSubject.value;
    if (current) {
      this.setConfig({
        ...current,
        data,
        totalRecords,
        loading: false,
        pageSize: pageSize,
      });
    }
  }
  updateActions(actions: GridConfig<T>['actions']) {
    const current = this.configSubject.value;
    this.configSubject.next({ ...current, actions });
  }

  setLoading(loading: boolean): void {
    const current = this.configSubject.value;
    if (current) {
      this.setConfig({ ...current, loading });
    }
  }
}
