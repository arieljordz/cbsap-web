import { Injectable } from '@angular/core';
import { SharedInvoiceDataDto } from '@core/model/purchase-order/shared-invoice-data..dto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PoLinesSharedService {
  private sharedInvDataToSearchPO$ =
    new BehaviorSubject<SharedInvoiceDataDto | null>(null);

  constructor() {}

  setSharedInvDataToSearchPO(data: SharedInvoiceDataDto) {
    this.sharedInvDataToSearchPO$.next(data);
  }
  getSharedInvDataToSearchPO() {
    return this.sharedInvDataToSearchPO$.asObservable();
  }
}
