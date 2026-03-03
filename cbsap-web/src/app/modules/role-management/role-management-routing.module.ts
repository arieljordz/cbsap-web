import { NgModule,  } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { RoleDetailsComponent } from './pages/role-details/role-details.component';
import { RoleEntityComponent } from './pages/role-entity/role-entity.component';

const routes: Routes = [
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleManagementRoutingModule { }
