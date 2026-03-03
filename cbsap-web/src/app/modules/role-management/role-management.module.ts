import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleManagementRoutingModule } from './role-management-routing.module';
import { SearchComponent } from './pages/search/search.component';
import { RoleDetailsComponent } from './pages/role-details/role-details.component';

import { AppPrimengModule } from 'src/app/shared/moduleResources/primengModule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RoleEntityComponent } from './pages/role-entity/role-entity.component';
import { RolePermissionComponent } from './pages/role-permission/role-permission.component';
import { RoleUserComponent } from './pages/role-user/role-user.component';
import { RoleReminderNotificationComponent } from './pages/role-reminder-notification/role-reminder-notification.component';



@NgModule({
    imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AppPrimengModule,
    RoleManagementRoutingModule,
    SearchComponent,
    RoleDetailsComponent,
    RoleEntityComponent,
    RolePermissionComponent,
    RoleUserComponent,
    RoleReminderNotificationComponent
]
})
export class RoleManagementModule { }
