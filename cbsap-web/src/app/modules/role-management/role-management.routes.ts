import { Routes } from "@angular/router";
import { RoleFormComponent } from "./pages/role-form/role-form.component";
import { SearchComponent } from "./pages/search/search.component";

export const ROLE_MGMT_ROUTES : Routes = [
        
      {
        path: '',
        component: SearchComponent
      },
      {
        path: 'add-role',
        component: RoleFormComponent
      },
      {
        path: 'edit-role/:roleID',
        component: RoleFormComponent
      }
];