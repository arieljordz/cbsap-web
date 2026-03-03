import { Routes } from "@angular/router";
import { SearchComponent } from "./pages/user-search/search.component";
import { UserDetailsComponent } from "./pages/user-details/user-details.component";

export const USER_ROUTES :Routes = [
    {
       path: '',
       component: SearchComponent
     },
     {
       path: 'edit-user/:userAccountID',
       component: UserDetailsComponent
     },
     {
       path: 'add-user',
       component: UserDetailsComponent
     }
];