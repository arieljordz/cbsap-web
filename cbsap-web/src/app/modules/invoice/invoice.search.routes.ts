import { Routes } from "@angular/router";

import { MyInvoiceSearchComponent } from "./pages/my-invoice-search/my-invoice-search.component";
import { RejectedQueueSearchComponent } from "./pages/rejected-queue-search/rejected-queue-search.component";
import { ExceptionQueueSearchComponent } from "./pages/exception-queue-search/exception-queue-search.component";
import { ArchiveQueueSearchComponent } from "./pages/archive-queue-search/archive-queue-search.component";

export const  INVOICE_SEARCH_ROUTES : Routes = [
 {
    path : '',
    component: MyInvoiceSearchComponent
 },
]

export const  REJECTED_INVOICE_ROUTES : Routes = [
 {
    path : '',
    component: RejectedQueueSearchComponent
 },
]

export const  EXCEPTION_INVOICE_ROUTES : Routes = [
 {
    path : '',
    component: ExceptionQueueSearchComponent
 },
]
export const  ARCHIVE_INVOICE_ROUTES : Routes = [
 {
    path : '',
    component: ArchiveQueueSearchComponent
 },
]

