import { Routes } from '@angular/router';
import { SupplierSearchComponent } from './pages/supplier-search/supplier-search.component';
import { SupplierDetailComponent } from './pages/supplier-detail/supplier-detail.component';
export const  SUPPLIER_ROUTES : Routes = [
 {
    path : '',
    component: SupplierSearchComponent
 },
 {
    path: 'add-supplier',
    component : SupplierDetailComponent
 },
 {
    path: 'edit-supplier/:supplierInfoID',
    component : SupplierDetailComponent
 }

]