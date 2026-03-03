import { Routes } from "@angular/router";
import { EntitySearchComponent } from "./pages/entity-search/entity-search.component";
import { EntityDetailsComponent } from "./pages/entity-details/entity-details.component";

export const ENTITY_PROFILE_ROUTES : Routes = [
    {
        path: '',
        component: EntitySearchComponent
    },
    {
        path: 'add-entity',
        component: EntityDetailsComponent
    },
    {
        path: 'edit-entity/:entityProfileID',
        component: EntityDetailsComponent
    }
]