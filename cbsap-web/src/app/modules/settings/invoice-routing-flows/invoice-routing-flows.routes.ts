import { Routes } from "@angular/router";
import { RoutingFlowDetailComponent } from "./pages/routing-flow-detail/routing-flow-detail.component";
import { RoutingFlowSearchComponent } from "./pages/routing-flow-search/routing-flow-search.component";

export const  INVOICE_ROUTING_ROUTES : Routes = [
 {
    path : '',
    component: RoutingFlowSearchComponent
 },
 {
    path: 'add-routing-flow',
    component : RoutingFlowDetailComponent
 },
 {
    path: 'edit-routing-flow/:invRoutingFlowID',
    component : RoutingFlowDetailComponent
 }

]