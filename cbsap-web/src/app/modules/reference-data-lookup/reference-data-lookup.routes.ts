import { Routes } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { PoReferenceComponent } from './po-reference/po-reference.component';
import { DimensionComponent } from './dimension/dimension.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';

export const REFERENCE_DATA_LOOKUP_ROUTES: Routes = [
  {
    path: 'accounts',
    component: AccountsComponent,
  },
  {
    path: 'dimensions',
    component: DimensionComponent,
  },
  {
    path: 'good-receipts',
    component: GoodsReceiptComponent,
  },
  {
    path: 'purchase-orders',
    component: PoReferenceComponent,
  },
];
